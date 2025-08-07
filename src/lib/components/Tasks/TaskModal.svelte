<script lang="ts">
	import type { Task, TaskStatus, Evidence, Milestone, Goal } from '$lib/models/types';
	import { calculatePriority, getEffortLabel, getPriorityLabel } from '$lib/services/priority';
	import { formatTargetDate } from '$lib/services/date';
	import { goalsStore, goals } from '$lib/stores/goalsStore';
	import { modalStore, type ModalMode } from '$lib/stores/modalStore';
	import Modal from '$lib/components/Modal.svelte';
	import TaskForm, { type TaskFormData } from '$lib/components/Tasks/TaskForm.svelte';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';
	import CompletionBadge from '$lib/components/CompletionBadge.svelte';
	import StatusDropdown from '$lib/components/Tasks/StatusDropdown.svelte';
	import ActionDropdown from '$lib/components/ActionDropdown.svelte';
	import EvidenceList from '$lib/components/Evidences/EvidenceList.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		task: Task | null;
		isOpen: boolean;
		mode: ModalMode;
		milestoneId?: string; // For creating new tasks
		onClose: () => void;
	}

	let { task, isOpen, mode, milestoneId, onClose }: Props = $props();

	let isSubmitting = $state(false);
	let showConfetti = $state(false);

	const priority = $derived(task ? calculatePriority(task.value, task.effort) : 0);
	const priorityLabel = $derived(task ? getPriorityLabel(priority) : '');
	const effortLabel = $derived(task ? getEffortLabel(task.value, task.effort) : '');

	// Default values for new tasks
	const defaultTask = {
		title: '',
		description: '',
		icon: '📝',
		status: 'planned' as const,
		value: 'high' as const,
		effort: 'low' as const,
		targetDate: {
			year: new Date().getFullYear() + 1
		}
	};

	// Get task data for duplication
	const taskDataForForm = $derived(() => {
		if (mode === 'create' && $modalStore.duplicateSourceTaskId) {
			// This is a duplicate case - find the original task and use its data
			const taskLocation = goalsStore.findTaskLocation($modalStore.duplicateSourceTaskId);
			if (taskLocation) {
				// Find the task in the goals data
				const goal = $goals.find((g: Goal) => g.id === taskLocation.goalId);
				const milestone = goal?.milestones.find(
					(milestone: Milestone) => milestone.id === taskLocation.milestoneId
				);
				const originalTask = milestone?.tasks.find(
					(task: Task) => task.id === $modalStore.duplicateSourceTaskId
				);

				if (originalTask) {
					return {
						...originalTask,
						title: originalTask.title + ' (Copy)',
						evidences: [], // Don't duplicate evidences
						status: 'planned'
					};
				}
			}
		}
		return task || defaultTask;
	});

	async function handleSave(formData: Omit<TaskFormData, 'status'>) {
		try {
			isSubmitting = true;

			if (mode === 'create') {
				if (!milestoneId) throw new Error(m.milestone_id_required_for_creating_tasks());

				const goalLocation = goalsStore.findMilestoneLocation(milestoneId);
				if (!goalLocation) throw new Error(m.goal_not_found());

				goalsStore.addTask(goalLocation, milestoneId, {
					...formData,
					status: 'planned',
					evidences: []
				});
				modalStore.closeTaskModal();
			} else if (mode === 'edit' && task) {
				const location = goalsStore.findTaskLocation(task.id);
				if (!location) throw new Error(m.task_location_not_found());

				const updatedTask: Task = {
					...task,
					title: formData.title,
					description: formData.description,
					icon: formData.icon,
					targetDate: formData.targetDate,
					value: formData.value,
					effort: formData.effort,
					status: 'planned',
					updatedAt: new Date().toISOString()
				};

				goalsStore.updateTask(location.goalId, location.milestoneId, updatedTask);
				modalStore.setTaskMode('view');
			}
		} catch (error) {
			console.error('Failed to save task:', error);
			alert(m.failed_to_save_task());
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (mode === 'create') {
			modalStore.closeTaskModal();
		} else {
			modalStore.setTaskMode('view');
		}
	}

	function handleEdit() {
		modalStore.setTaskMode('edit');
	}

	function handleDelete() {
		if (task) {
			const location = goalsStore.findTaskLocation(task.id);
			if (location) {
				goalsStore.deleteTask(location.goalId, location.milestoneId, task.id);
				modalStore.closeTaskModal();
			}
		}
	}

	function handleDuplicate() {
		if (task) {
			const location = goalsStore.findTaskLocation(task.id);
			if (location) {
				modalStore.openDuplicateTaskModal(task.id, location.milestoneId);
			}
		}
	}

	function handleStatusChange(newStatus: TaskStatus) {
		if (!task) return;

		const location = goalsStore.findTaskLocation(task.id);
		if (location) {
			const updatedTask: Task = {
				...task,
				status: newStatus,
				updatedAt: new Date().toISOString()
			};
			goalsStore.updateTask(location.goalId, location.milestoneId, updatedTask);
			if (newStatus === 'done') {
				showConfetti = true;
				setTimeout(() => {
					showConfetti = false;
				}, 3000);
			}
		}
	}

	function handleAddEvidence() {
		if (!task) return;
		const location = goalsStore.findTaskLocation(task.id);
		if (location) {
			modalStore.openEvidenceModal({
				type: 'task',
				goalId: location.goalId,
				milestoneId: location.milestoneId,
				taskId: task.id
			});
		}
	}

	function handleEditEvidence(evidence: Evidence) {
		if (!task) return;
		const location = goalsStore.findTaskLocation(task.id);
		if (location) {
			modalStore.openEvidenceModal({
				type: 'task',
				goalId: location.goalId,
				milestoneId: location.milestoneId,
				taskId: task.id,
				editingEvidenceId: evidence.id
			});
		}
	}

	function handleDeleteEvidence(evidenceId: string) {
		if (!task) return;
		const location = goalsStore.findTaskLocation(task.id);
		if (location) {
			goalsStore.deleteTaskEvidence(location.goalId, location.milestoneId, task.id, evidenceId);
		}
	}
</script>

<Modal
	{isOpen}
	{onClose}
	title={mode === 'create'
		? m.create_new_task()
		: mode === 'edit'
			? m.edit_task()
			: m.task_details()}
	{showConfetti}
>
	<div class="task-modal-content">
		{#if mode === 'edit' || mode === 'create'}
			<!-- Edit/Create Mode -->
			{@const taskData = taskDataForForm()}
			<TaskForm
				title={taskData.title}
				description={taskData.description}
				icon={taskData.icon}
				targetDate={taskData.targetDate}
				value={taskData.value}
				effort={taskData.effort}
				onSave={handleSave}
				onCancel={handleCancel}
				{isSubmitting}
			/>
		{:else if task}
			<!-- View Mode -->
			<!-- Task Header -->
			<div class="task-header-section">
				<div class="task-title-area">
					{#if task.icon}
						<span class="task-icon">{task.icon}</span>
					{/if}
					<div class="task-text">
						<div class="task-title">
							<h3>{task.title}</h3>
							<div class="priority-badge priority-{priority}" title={effortLabel}>
								{priorityLabel}
							</div>
							<StatusDropdown
								status={task.status}
								onStatusChange={handleStatusChange}
								size="medium"
							/>
						</div>
						<p class="task-description">{task.description}</p>
					</div>
					<div class="header-actions">
						<ActionDropdown
							onEdit={handleEdit}
							onDelete={handleDelete}
							onDuplicate={handleDuplicate}
							deleteConfirmMessage={m.are_you_sure_you_want_to_delete_this_task()}
							itemName={task.title}
							itemType="task"
						/>
					</div>
				</div>

				<div class="task-meta-info">
					{#if task.status !== 'done'}
						<div class="target-date-info">
							<TimeRemaining
								targetDate={task.targetDate}
								size="medium"
								extraText={m.expected_by({ date: formatTargetDate(task.targetDate) })}
							/>
						</div>
					{:else}
						<div class="target-date-info">
							<CompletionBadge
								targetDate={task.targetDate}
								size="medium"
								extraText={m.expected_by({ date: formatTargetDate(task.targetDate) })}
							/>
						</div>
					{/if}
				</div>
			</div>

			<!-- Evidences Section -->
			<EvidenceList
				evidences={task.evidences || []}
				onAdd={handleAddEvidence}
				onEdit={handleEditEvidence}
				onDelete={handleDeleteEvidence}
			/>
		{:else}
			<div class="error-state">
				<p>{m.task_not_found()}</p>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.task-modal-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		min-width: 600px;
		max-width: 800px;
		width: 100%;
		padding: var(--spacing-lg);
	}

	.task-header-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.task-title-area {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.header-actions {
		margin-left: auto;
		display: flex;
		gap: var(--spacing-sm);
	}

	.task-icon {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.task-text {
		flex: 1;
		min-width: 0;
	}

	.task-text h3 {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
	}

	.task-description {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.task-meta-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.task-title {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.priority-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-md);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
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

	.date-section {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.date-label {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		font-weight: 500;
		text-transform: uppercase;
	}

	.date-value {
		font-size: 1rem;
		color: var(--color-text-secondary);
		font-weight: 500;
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

	.error-state {
		padding: var(--spacing-lg);
		text-align: center;
		color: var(--color-text-muted);
	}

	@media (max-width: 768px) {
		.task-modal-content {
			min-width: unset;
			width: 100%;
			padding: var(--spacing-md);
		}

		.task-header-section {
			gap: var(--spacing-md);
		}

		.task-text h3 {
			font-size: 1.25rem;
		}

		.task-meta-info {
			gap: var(--spacing-sm);
		}

		.meta-row {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}
	}
</style>
