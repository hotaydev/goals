<script lang="ts">
	import type {
		Milestone,
		SMARTCriteria,
		TargetDate,
		ValueEffortLevel,
		Evidence,
		Goal
	} from '$lib/models/types';
	import { calculatePriority, getEffortLabel, getPriorityLabel } from '$lib/services/priority';
	import { getMilestoneCompletionPercentage } from '$lib/services/percentage';
	import { formatTargetDate } from '$lib/services/date';
	import { goalsStore, goals } from '$lib/stores/goalsStore';
	import { modalStore, type ModalMode } from '$lib/stores/modalStore';
	import { Plus } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SMARTSection from '$lib/components/SMARTSection.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import TaskList from '$lib/components/Tasks/TaskList.svelte';
	import EditableForm from '$lib/components/EditableForm.svelte';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';
	import CompletionBadge from '$lib/components/CompletionBadge.svelte';
	import ActionDropdown from '$lib/components/ActionDropdown.svelte';
	import EvidenceList from '$lib/components/Evidences/EvidenceList.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		milestone: Milestone | null;
		isOpen: boolean;
		mode: ModalMode;
		goalId?: string; // For creating new milestones
		onClose: () => void;
	}

	interface MilestoneFormData {
		title: string;
		description: string;
		icon?: string;
		smart: SMARTCriteria;
		targetDate: TargetDate;
		value: ValueEffortLevel;
		effort: ValueEffortLevel;
	}

	let { milestone, isOpen, mode, goalId, onClose }: Props = $props();

	let isSubmitting = $state(false);

	const priority = $derived(milestone ? calculatePriority(milestone.value, milestone.effort) : 0);
	const priorityLabel = $derived(milestone ? getPriorityLabel(priority) : '');
	const effortLabel = $derived(milestone ? getEffortLabel(milestone.value, milestone.effort) : '');
	const completionPercentage = $derived(
		milestone ? getMilestoneCompletionPercentage(milestone.tasks) : 0
	);

	// Default values for new milestones
	const defaultMilestone = {
		title: '',
		description: '',
		icon: '🎯',
		value: 'high' as const,
		effort: 'low' as const,
		smart: {
			specific: '',
			measurable: '',
			achievable: '',
			relevant: '',
			timeBound: ''
		},
		targetDate: {
			year: new Date().getFullYear() + 1
		}
	};

	// Get milestone data for duplication
	const milestoneDataForForm = $derived(() => {
		if (mode === 'create' && $modalStore.duplicateSourceMilestoneId) {
			// This is a duplicate case - find the original milestone and use its data
			const goalId = goalsStore.findMilestoneLocation($modalStore.duplicateSourceMilestoneId);
			if (goalId) {
				// Find the milestone in the goals data
				const goal = $goals.find((g: Goal) => g.id === goalId);
				const originalMilestone = goal?.milestones.find(
					(milestone: Milestone) => milestone.id === $modalStore.duplicateSourceMilestoneId
				);

				if (originalMilestone) {
					return {
						...originalMilestone,
						title: originalMilestone.title + ' (Copy)',
						tasks: [], // Don't duplicate tasks
						evidences: [] // Don't duplicate evidences
					};
				}
			}
		}
		return milestone || defaultMilestone;
	});

	async function handleSave(formData: MilestoneFormData) {
		try {
			isSubmitting = true;

			if (mode === 'create') {
				if (!goalId) throw new Error(m.goal_id_required_for_creating_milestones());

				goalsStore.addMilestone(goalId, {
					...formData,
					evidences: []
				});
				modalStore.closeMilestoneModal();
			} else if (mode === 'edit' && milestone) {
				const milestoneGoalId = goalsStore.findMilestoneLocation(milestone.id);
				if (!milestoneGoalId) throw new Error(m.goal_not_found());

				const updatedMilestone: Milestone = {
					...milestone,
					title: formData.title,
					description: formData.description,
					icon: formData.icon,
					smart: formData.smart,
					targetDate: formData.targetDate,
					value: formData.value,
					effort: formData.effort,
					updatedAt: new Date().toISOString()
				};

				goalsStore.updateMilestone(milestoneGoalId, updatedMilestone);
				modalStore.setMilestoneMode('view');
			}
		} catch (error) {
			console.error('Failed to save milestone:', error);
			alert(m.failed_to_save_milestone());
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (mode === 'create') {
			modalStore.closeMilestoneModal();
		} else {
			modalStore.setMilestoneMode('view');
		}
	}

	function handleEdit() {
		modalStore.setMilestoneMode('edit');
	}

	function handleDelete() {
		if (milestone) {
			const goalId = goalsStore.findMilestoneLocation(milestone.id);
			if (goalId) {
				goalsStore.deleteMilestone(goalId, milestone.id);
				modalStore.closeMilestoneModal();
			}
		}
	}

	function handleDuplicate() {
		if (milestone) {
			const goalId = goalsStore.findMilestoneLocation(milestone.id);
			if (goalId) {
				modalStore.openDuplicateMilestoneModal(milestone.id, goalId);
			}
		}
	}

	function handleCreateTask() {
		if (milestone) {
			modalStore.openCreateTaskModal(milestone.id);
		}
	}

	function handleAddEvidence() {
		if (!milestone) return;
		const goalId = goalsStore.findMilestoneLocation(milestone.id);
		if (goalId) {
			modalStore.openEvidenceModal({
				type: 'milestone',
				goalId: goalId,
				milestoneId: milestone.id
			});
		}
	}

	function handleEditEvidence(evidence: Evidence) {
		if (!milestone) return;
		const goalId = goalsStore.findMilestoneLocation(milestone.id);
		if (goalId) {
			modalStore.openEvidenceModal({
				type: 'milestone',
				goalId: goalId,
				milestoneId: milestone.id,
				editingEvidenceId: evidence.id
			});
		}
	}

	function handleDeleteEvidence(evidenceId: string) {
		if (!milestone) return;
		const goalId = goalsStore.findMilestoneLocation(milestone.id);
		if (goalId) {
			goalsStore.deleteMilestoneEvidence(goalId, milestone.id, evidenceId);
		}
	}
</script>

<Modal
	{isOpen}
	{onClose}
	title={mode === 'create'
		? m.create_new_milestone()
		: mode === 'edit'
			? m.edit_milestone()
			: m.milestone_details()}
>
	<div class="milestone-modal-content">
		{#if mode === 'edit' || mode === 'create'}
			<!-- Edit/Create Mode -->
			{@const milestoneData = milestoneDataForForm()}
			<EditableForm
				title={milestoneData.title}
				description={milestoneData.description}
				icon={milestoneData.icon}
				smart={milestoneData.smart}
				targetDate={milestoneData.targetDate}
				value={milestoneData.value}
				effort={milestoneData.effort}
				onSave={handleSave}
				onCancel={handleCancel}
				{isSubmitting}
			/>
		{:else if milestone}
			<!-- View Mode -->
			<!-- Milestone Header -->
			<div class="milestone-header-section">
				<div class="milestone-title-area">
					{#if milestone.icon}
						<span class="milestone-icon">{milestone.icon}</span>
					{/if}
					<div class="milestone-text">
						<div class="milestone-title">
							<h3>{milestone.title}</h3>
							<span class="priority-badge priority-{priority}" title={effortLabel}>
								{priorityLabel}
							</span>
						</div>
						<p class="milestone-description">{milestone.description}</p>
					</div>
					<div class="header-actions">
						<ActionDropdown
							onEdit={handleEdit}
							onDelete={handleDelete}
							onDuplicate={handleDuplicate}
							deleteConfirmMessage={m.are_you_sure_you_want_to_delete_milestone()}
							itemName={milestone.title}
							itemType="milestone"
						/>
					</div>
				</div>

				<div class="milestone-meta-info">
					<ProgressBar percentage={completionPercentage} />
					<div class="target-date-info">
						{#if completionPercentage < 100}
							<TimeRemaining
								targetDate={milestone.targetDate}
								size="medium"
								extraText={m.expected_by({ date: formatTargetDate(milestone.targetDate) })}
							/>
						{:else}
							<CompletionBadge
								targetDate={milestone.targetDate}
								size="medium"
								extraText={m.expected_by({ date: formatTargetDate(milestone.targetDate) })}
							/>
						{/if}
					</div>
				</div>
			</div>

			<!-- SMART Criteria Section -->
			<SMARTSection smart={milestone.smart} compact defaultExpanded={false} />

			<!-- Tasks Section -->
			<div class="tasks-section">
				<div class="tasks-header">
					<h3>{m.tasks()}</h3>
					<button
						class="action-button primary"
						onclick={handleCreateTask}
						title={m.create_new_task()}
					>
						<Plus size={16} />
						{m.new_task()}
					</button>
				</div>
				<TaskList tasks={milestone.tasks} />
			</div>

			<!-- Evidences Section -->
			<EvidenceList
				evidences={milestone.evidences || []}
				onAdd={handleAddEvidence}
				onEdit={handleEditEvidence}
				onDelete={handleDeleteEvidence}
			/>
		{:else}
			<div class="error-state">
				<p>{m.milestone_not_found()}</p>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.milestone-modal-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		min-width: 700px;
		max-width: 1000px;
		width: 100%;
		padding: var(--spacing-lg);
	}

	.milestone-header-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	.milestone-title-area {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.milestone-title {
		display: flex;
		gap: var(--spacing-sm);
		align-items: center;
		justify-content: start;
	}

	.header-actions {
		margin-left: auto;
		display: flex;
		gap: var(--spacing-sm);
	}

	.milestone-icon {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.milestone-text {
		flex: 1;
		min-width: 0;
	}

	.milestone-text h3 {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
	}

	.milestone-description {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.milestone-meta-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.priority-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-md);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		align-self: flex-start;
		border-left: none;
	}

	.priority-badge.priority-5 {
		background-color: var(--color-success);
		color: white;
	}

	.priority-badge.priority-4 {
		background-color: var(--color-primary);
		color: white;
	}

	.priority-badge.priority-2 {
		background-color: var(--color-warning);
		color: white;
	}

	.priority-badge.priority-1 {
		background-color: var(--color-error);
		color: white;
	}

	.target-date-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.tasks-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.tasks-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
	}

	.tasks-section h3 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.125rem;
	}

	.action-button {
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-background);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.action-button:hover {
		background-color: var(--color-surface);
		border-color: var(--color-text-muted);
		color: var(--color-text-primary);
	}

	.action-button.primary {
		background-color: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.action-button.primary:hover {
		background-color: var(--color-primary-hover);
		border-color: var(--color-primary-hover);
		color: white;
	}

	.date-value {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.milestone-modal-content {
			min-width: unset;
			width: 100%;
			padding: var(--spacing-md);
		}

		.milestone-header-section {
			gap: var(--spacing-md);
		}

		.milestone-text h3 {
			font-size: 1.25rem;
		}

		.milestone-meta-info {
			gap: var(--spacing-sm);
		}
	}
</style>
