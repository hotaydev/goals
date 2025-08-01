<script lang="ts">
	import { ChevronDown, ChevronRight } from '@lucide/svelte';
	import type { Milestone } from '$lib/models/types';
	import { calculatePriority, getPriorityLabel } from '$lib/services/priority';
	import { getMilestoneCompletionPercentage } from '$lib/services/percentage';
	import { formatTargetDate } from '$lib/services/date';
	import ProgressBar from './ProgressBar.svelte';
	import TaskKanban from './TaskKanban.svelte';

	let { milestone }: { milestone: Milestone } = $props();

	let isExpanded = $state(false);

	const priority = $derived(calculatePriority(milestone.value, milestone.effort));
	const priorityLabel = $derived(getPriorityLabel(priority));
	const completionPercentage = $derived(getMilestoneCompletionPercentage(milestone.tasks));

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}
</script>

<div class="milestone-card priority-{priority}">
	<button class="milestone-header" onclick={toggleExpanded}>
		<div class="milestone-info">
			<div class="milestone-title-section">
				{#if milestone.icon}
					<span class="milestone-icon">{milestone.icon}</span>
				{/if}
				<div class="milestone-text">
					<h3>{milestone.title}</h3>
					<p class="milestone-description">{milestone.description}</p>
				</div>
			</div>

			<div class="milestone-meta">
				<div class="priority-badge priority-{priority}">
					{priorityLabel}
				</div>
				<div class="completion-indicator">
					<span class="completion-text">{completionPercentage.toFixed(1)}% Complete</span>
				</div>
				<div class="target-date">
					<span class="date-label">Target date:</span>
					<span class="date-value">{formatTargetDate(milestone.targetDate)}</span>
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

	<div class="milestone-progress">
		<ProgressBar percentage={completionPercentage} showLabel={false} />
	</div>

	{#if isExpanded}
		<div class="milestone-content">
			<TaskKanban tasks={milestone.tasks} />
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
		width: 100%;
		background: none;
		border: none;
		padding: var(--spacing-lg);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		text-align: left;
		transition: background-color var(--transition-fast);
	}

	.milestone-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		min-width: 0;
	}

	.milestone-title-section {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-sm);
	}

	.milestone-icon {
		font-size: 1.5rem;
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
		word-wrap: break-word;
	}

	.milestone-description {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.milestone-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		flex-wrap: wrap;
	}

	.priority-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
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

	.target-date {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
	}

	.date-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		font-weight: 500;
		text-transform: uppercase;
	}

	.date-value {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.expand-icon {
		color: var(--color-text-muted);
		flex-shrink: 0;
		transition: transform var(--transition-fast);
	}

	.milestone-progress {
		padding: 0 var(--spacing-lg) var(--spacing-md) var(--spacing-lg);
		background-color: inherit;
		transition: background-color var(--transition-fast);
	}

	/* Make progress bar background more visible on hover */
	.milestone-card:hover :global(.progress-bar) {
		background-color: var(--color-border);
	}

	.milestone-content {
		border-top: 1px solid var(--color-border);
		padding: var(--spacing-lg);
		background-color: var(--color-background);
	}

	@media (max-width: 768px) {
		.milestone-header {
			padding: var(--spacing-md);
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
			gap: var(--spacing-xs);
		}
	}
</style>
