<script lang="ts">
	import type { Task } from '$lib/models/types';
	import { calculatePriority, getPriorityLabel } from '$lib/services/priority';
	import { formatTargetDate } from '$lib/services/date';

	let { task }: { task: Task } = $props();

	const priority = $derived(calculatePriority(task.value, task.effort));
	const priorityLabel = $derived(getPriorityLabel(priority));

	function handleTaskClick() {
		// TODO: Open task details modal
		console.log('Task clicked:', task.title);
	}
</script>

<button
	class="task-card priority-{priority}"
	onclick={handleTaskClick}
	onkeydown={(e) => e.key === 'Enter' && handleTaskClick()}
	tabindex="0"
>
	<div class="task-header">
		{#if task.icon}
			<span class="task-icon">{task.icon}</span>
		{/if}
		<div class="task-title-section">
			<h5>{task.title}</h5>
			<div class="priority-badge priority-{priority}">
				{priorityLabel}
			</div>
		</div>
	</div>

	<p class="task-description">{task.description}</p>

	<div class="task-footer">
		<div class="task-dates">
			<span class="date-label">Target date:</span>
			<span class="date-value">{formatTargetDate(task.targetDate)}</span>
		</div>
	</div>
</button>

<style>
	.task-card {
		width: 100%;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		text-align: left;
		font-family: inherit;
		font-size: inherit;
	}

	.task-card:hover {
		box-shadow: var(--shadow-sm);
		border-color: var(--color-border-hover);
		transform: translateY(-1px);
	}

	.task-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-sm);
	}

	.task-icon {
		font-size: 1.25rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.task-title-section {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.task-title-section h5 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		word-wrap: break-word;
	}

	.priority-badge {
		padding: 2px var(--spacing-xs);
		border-radius: var(--radius-sm);
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		align-self: flex-start;
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

	.task-description {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		line-height: 1.5;
		flex: 1;
	}

	.task-footer {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		padding-top: var(--spacing-xs);
		border-top: 1px solid var(--color-border);
	}

	.task-dates {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.date-label {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.date-value {
		font-size: 0.625rem;
		color: var(--color-text-secondary);
	}

	/* Priority border indicators */
	.task-card.priority-5 {
		border-left: 4px solid var(--color-success);
	}

	.task-card.priority-4 {
		border-left: 4px solid var(--color-primary);
	}

	.task-card.priority-2 {
		border-left: 4px solid var(--color-warning);
	}

	.task-card.priority-1 {
		border-left: 4px solid var(--color-error);
	}
</style>
