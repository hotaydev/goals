<script lang="ts">
	import type { Goal } from '$lib/models/types';
	import { formatTargetDate } from '$lib/services/date';
	import { storageService } from '$lib/services/storage';
	import { modalStore, type ModalMode } from '$lib/stores/modalStore';
	import { Edit, Plus } from '@lucide/svelte';
	import Modal from './Modal.svelte';
	import SMARTSectionCompact from './SMARTSectionCompact.svelte';
	import MilestoneCard from './MilestoneCard.svelte';
	import GoalForm, { type GoalFormData } from './GoalForm.svelte';
	import TimeRemaining from './TimeRemaining.svelte';

	interface Props {
		goal: Goal;
		isOpen: boolean;
		mode: ModalMode;
		onClose: () => void;
	}

	let { goal, isOpen, mode, onClose }: Props = $props();

	let isSubmitting = $state(false);

	async function handleSave(formData: GoalFormData) {
		try {
			isSubmitting = true;

			const updatedGoal: Goal = {
				...goal,
				title: formData.title,
				description: formData.description,
				icon: formData.icon,
				smart: formData.smart,
				targetDate: formData.targetDate,
				updatedAt: new Date().toISOString()
			};

			storageService.updateGoal(updatedGoal);
			modalStore.setGoalMode('view');
		} catch (error) {
			console.error('Failed to save goal:', error);
			alert('Failed to save goal. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		modalStore.setGoalMode('view');
	}

	function handleEdit() {
		modalStore.setGoalMode('edit');
	}

	function handleCreateMilestone() {
		modalStore.openCreateMilestoneModal(goal.id);
	}
</script>

<Modal {isOpen} {onClose} title={mode === 'edit' ? 'Edit Goal' : 'Goal Details'}>
	<div class="goal-modal-content">
		{#if mode === 'edit'}
			<!-- Edit Mode -->
			<GoalForm
				title={goal.title}
				description={goal.description}
				icon={goal.icon}
				smart={goal.smart}
				targetDate={goal.targetDate}
				onSave={handleSave}
				onCancel={handleCancel}
				{isSubmitting}
			/>
		{:else}
			<!-- View Mode -->
			<!-- Goal Header -->
			<div class="goal-header-section">
				<div class="goal-title-area">
					{#if goal.icon}
						<span class="goal-icon">{goal.icon}</span>
					{/if}
					<div class="goal-text">
						<h3>{goal.title}</h3>
						<p class="goal-description">{goal.description}</p>
					</div>
					<div class="header-actions">
						<button class="action-button" onclick={handleEdit} title="Edit goal">
							<Edit size={16} />
						</button>
					</div>
				</div>

				<div class="goal-meta-info">
					<div class="target-date-info">
						<span class="date-label">Target date:</span>
						<span class="date-value">{formatTargetDate(goal.targetDate)}</span>
					</div>
					<TimeRemaining targetDate={goal.targetDate} size="medium" />
				</div>
			</div>

			<!-- SMART Criteria Section -->
			<SMARTSectionCompact smart={goal.smart} />

			<!-- Milestones Section -->
			<div class="milestones-section">
				<div class="milestones-header">
					<h3>Milestones</h3>
					<button
						class="action-button primary"
						onclick={handleCreateMilestone}
						title="Create new milestone"
					>
						<Plus size={16} />
						New Milestone
					</button>
				</div>
				<div class="milestones-list">
					{#each goal.milestones as milestone (milestone.id)}
						<MilestoneCard {milestone} />
					{/each}
					{#if goal.milestones.length === 0}
						<div class="empty-state">
							<p>
								No milestones yet. Create your first milestone to break down this goal into
								manageable steps.
							</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.goal-modal-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		min-width: 700px;
		max-width: 1000px;
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
	}

	.goal-header-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	.goal-title-area {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.header-actions {
		margin-left: auto;
		display: flex;
		gap: var(--spacing-sm);
	}

	.goal-icon {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.goal-text {
		flex: 1;
		min-width: 0;
	}

	.goal-text h3 {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
	}

	.goal-description {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.goal-meta-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.target-date-info {
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

	.milestones-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.milestones-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
	}

	.milestones-section h3 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.125rem;
	}

	.milestones-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-xl);
		color: var(--color-text-muted);
		font-style: italic;
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
		background-color: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
		color: white;
	}

	@media (max-width: 768px) {
		.goal-modal-content {
			min-width: unset;
			width: 100%;
		}

		.goal-header-section {
			gap: var(--spacing-md);
		}

		.goal-text h3 {
			font-size: 1.25rem;
		}

		.goal-meta-info {
			gap: var(--spacing-sm);
		}

		.milestones-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-sm);
		}

		.action-button.primary {
			align-self: stretch;
		}
	}
</style>
