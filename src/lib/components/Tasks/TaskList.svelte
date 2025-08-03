<script lang="ts">
	import type { Task } from '$lib/models/types';
	import { calculatePriority, getEffortLabel, getPriorityLabel } from '$lib/services/priority';
	import { targetDateToDate } from '$lib/services/date';
	import { modalStore } from '$lib/stores/modalStore';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';

	interface Props {
		tasks: Task[];
	}

	let { tasks }: Props = $props();

	const sortedTasks = $derived(
		[...tasks].sort((a, b) => {
			// First sort by priority (highest first)
			const priorityA = calculatePriority(a.value, a.effort);
			const priorityB = calculatePriority(b.value, b.effort);

			if (priorityA !== priorityB) {
				return priorityB - priorityA;
			}

			// Then sort by target date (earliest first)
			const dateA = targetDateToDate(a.targetDate);
			const dateB = targetDateToDate(b.targetDate);
			if (!dateA || !dateB) return 0;
			return dateA.getTime() - dateB.getTime();
		})
	);

	function handleTaskView(task: Task) {
		modalStore.openTaskModal(task.id);
	}
</script>

<div class="task-list">
	{#if sortedTasks.length === 0}
		<div class="empty-state">
			<p>No tasks yet. Create your first task to get started!</p>
		</div>
	{:else}
		{#each sortedTasks as task (task.id)}
			{@const priority = calculatePriority(task.value, task.effort)}
			{@const priorityLabel = getPriorityLabel(priority)}
			{@const effortLabel = getEffortLabel(task.value, task.effort)}
			<div
				class="task-item priority-{priority}"
				onclick={() => handleTaskView(task)}
				onkeydown={(e) => e.key === 'Enter' && handleTaskView(task)}
				role="button"
				tabindex="0"
			>
				{#if task.icon}
					<span class="task-icon">{task.icon}</span>
				{/if}

				<div class="task-content">
					<div class="priority-badge priority-{priority}" title={effortLabel}>
						{priorityLabel}
					</div>
					<span class="task-title">{task.title}</span>
				</div>

				<div class="task-badges">
					<div class="status-badge status-{task.status}">
						{task.status.replace('_', ' ')}
					</div>
				</div>

				<div class="task-date">
					<TimeRemaining targetDate={task.targetDate} size="small" />
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.task-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xl);
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
		background-color: var(--color-surface-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.empty-state p {
		margin: 0;
	}

	.task-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		min-height: 40px;
	}

	.task-item:hover {
		box-shadow: var(--shadow-sm);
		border-color: var(--color-border-hover);
		transform: translateY(-1px);
		background-color: var(--color-surface);
	}

	.task-icon {
		font-size: 1rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.task-content {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.task-title {
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.task-description {
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.task-badges {
		display: flex;
		gap: var(--spacing-xs);
		flex-shrink: 0;
	}

	.priority-badge,
	.status-badge {
		padding: 2px var(--spacing-xs);
		border-radius: var(--radius-sm);
		font-size: 0.625rem;
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

	.status-badge.status-planned {
		background-color: var(--color-text-muted);
		color: white;
	}

	.status-badge.status-in_progress {
		background-color: var(--color-warning);
		color: white;
	}

	.status-badge.status-done {
		background-color: var(--color-success);
		color: white;
	}

	.task-date {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.date-label {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.date-value {
		font-size: 0.625rem;
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.task-actions {
		display: flex;
		gap: var(--spacing-xs);
		opacity: 0;
		transition: opacity var(--transition-fast);
		flex-shrink: 0;
	}

	.task-item:hover .task-actions {
		opacity: 1;
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 2px;
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
		transform: scale(1.05);
	}

	.action-button.view:hover {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.action-button.edit:hover {
		background-color: var(--color-warning);
		border-color: var(--color-warning);
		color: white;
	}

	/* Priority border indicators */
	.task-item.priority-5 {
		border-left: 4px solid var(--color-success);
	}

	.task-item.priority-4 {
		border-left: 4px solid var(--color-primary);
	}

	.task-item.priority-2 {
		border-left: 4px solid var(--color-warning);
	}

	.task-item.priority-1 {
		border-left: 4px solid var(--color-error);
	}

	@media (max-width: 768px) {
		.task-item {
			gap: var(--spacing-sm);
		}

		.task-content {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-xs);
		}

		.task-title {
			max-width: none;
		}

		.task-badges {
			flex-wrap: wrap;
		}

		.task-actions {
			opacity: 1;
		}
	}
</style>
