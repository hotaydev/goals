<script lang="ts">
	import { ChevronDown, ChevronRight, Target } from '@lucide/svelte';
	import type { Milestone } from '$lib/models/types';
	import { calculatePriority, getEffortLabel, getPriorityLabel } from '$lib/services/priority';
	import { getMilestoneCompletionPercentage } from '$lib/services/percentage';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import TaskList from '$lib/components/Tasks/TaskList.svelte';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { m } from '$lib/paraglide/messages';

	let { milestone }: { milestone: Milestone } = $props();

	let isExpanded = $state(false);

	const priority = $derived(calculatePriority(milestone.value, milestone.effort));
	const priorityLabel = $derived(getPriorityLabel(priority));
	const effortLabel = $derived(getEffortLabel(milestone.value, milestone.effort));
	const completionPercentage = $derived(getMilestoneCompletionPercentage(milestone.tasks));

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	function openModal() {
		modalStore.openMilestoneModal(milestone.id);
	}
</script>

<div class="milestone-card priority-{priority}">
	<div class="milestone-header">
		<button class="milestone-expand-button" onclick={toggleExpanded}>
			<div class="milestone-info">
				<div class="milestone-title-section">
					{#if milestone.icon}
						<span class="milestone-icon">{milestone.icon}</span>
					{/if}
					<div class="milestone-text">
						<div class="milestone-meta">
							<h3>{milestone.title}</h3>
							<div class="priority-badge priority-{priority}" title={effortLabel}>
								{priorityLabel}
							</div>
							{#if completionPercentage < 100}
								<TimeRemaining targetDate={milestone.targetDate} size="medium" />
							{:else}
								<p class="priority-badge priority-5">
									{m.completed()}
								</p>
							{/if}
						</div>
						<p class="milestone-description">{milestone.description}</p>
					</div>
				</div>
			</div>

			<div class="expand-icon">
				{#if isExpanded}
					<ChevronDown size={20} />
				{:else}
					<ChevronRight size={20} />
				{/if}
			</div>
		</button>

		<div class="milestone-actions">
			<button class="smart-button" onclick={openModal} title={m.view_smart_objectives()}>
				<Target size={16} />
				{m.details()}
			</button>
		</div>
	</div>

	<div class="milestone-progress">
		<ProgressBar percentage={completionPercentage} />
	</div>

	{#if isExpanded}
		<div class="milestone-content">
			<TaskList tasks={milestone.tasks} />
		</div>
	{/if}
</div>

<style>
	.milestone-card {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all var(--transition-fast);
	}

	.milestone-card:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--color-border-hover);
		background-color: var(--color-surface-elevated);
	}

	.milestone-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
	}

	.milestone-expand-button {
		flex: 1;
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		text-align: left;
		transition: background-color var(--transition-fast);
		padding: 0;
	}

	.milestone-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-width: 0;
	}

	.milestone-title-section {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-sm);
	}

	.milestone-icon {
		font-size: 1.25rem;
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
		font-size: 1.125rem;
		word-wrap: break-word;
	}

	.milestone-description {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.milestone-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.priority-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
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

	.completion-indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.completion-text {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}
	.milestone-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.smart-button {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-fast);
		text-transform: uppercase;
	}

	.smart-button:hover {
		background-color: var(--color-primary-hover);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: var(--spacing-xs);
		background-color: var(--color-background);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.action-button:hover {
		background-color: var(--color-surface);
		border-color: var(--color-text-muted);
		color: var(--color-text-primary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.expand-icon {
		color: var(--color-text-muted);
		flex-shrink: 0;
		transition: transform var(--transition-fast);
	}

	.milestone-progress {
		padding: 0 var(--spacing-md) var(--spacing-sm) var(--spacing-md);
		background-color: inherit;
		transition: background-color var(--transition-fast);
	}

	/* Make progress bar background more visible on hover */
	.milestone-card:hover :global(.progress-bar) {
		background-color: var(--color-border);
	}

	.milestone-content {
		border-top: 1px solid var(--color-border);
		padding: var(--spacing-md);
		background-color: var(--color-background);
	}

	@media (max-width: 768px) {
		.milestone-header {
			padding: var(--spacing-md);
			flex-direction: column;
			align-items: stretch;
			gap: var(--spacing-sm);
		}

		.milestone-content {
			padding: var(--spacing-md);
		}

		.milestone-progress {
			padding: 0 var(--spacing-md) var(--spacing-sm) var(--spacing-md);
		}

		.milestone-meta {
			flex-direction: column;
			align-items: flex-start;
		}

		.milestone-actions {
			align-self: flex-end;
		}
	}
</style>
