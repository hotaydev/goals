<script lang="ts">
	import type { Task } from '$lib/models/types';
	import { calculatePriority } from '$lib/services/priority';
	import TaskCard from './TaskCard.svelte';

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

			return 0;
		})
	);

	const plannedTasks = $derived(sortedTasks.filter((task) => task.status === 'planned'));
	const inProgressTasks = $derived(sortedTasks.filter((task) => task.status === 'in_progress'));
	const doneTasks = $derived(sortedTasks.filter((task) => task.status === 'done'));
</script>

<div class="task-kanban">
	<div class="kanban-column">
		<div class="column-header planned">
			<h4>Planned</h4>
			<span class="task-count">{plannedTasks.length}</span>
		</div>
		<div class="column-content">
			{#each plannedTasks as task (task.id)}
				<TaskCard {task} />
			{/each}
			{#if plannedTasks.length === 0}
				<div class="empty-column">
					<p>No planned tasks</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="kanban-column">
		<div class="column-header in-progress">
			<h4>In Progress</h4>
			<span class="task-count">{inProgressTasks.length}</span>
		</div>
		<div class="column-content">
			{#each inProgressTasks as task (task.id)}
				<TaskCard {task} />
			{/each}
			{#if inProgressTasks.length === 0}
				<div class="empty-column">
					<p>No tasks in progress</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="kanban-column">
		<div class="column-header done">
			<h4>Done</h4>
			<span class="task-count">{doneTasks.length}</span>
		</div>
		<div class="column-content">
			{#each doneTasks as task (task.id)}
				<TaskCard {task} />
			{/each}
			{#if doneTasks.length === 0}
				<div class="empty-column">
					<p>No completed tasks</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.task-kanban {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-lg);
		min-height: 200px;
	}

	.kanban-column {
		display: flex;
		flex-direction: column;
		background-color: var(--color-surface-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.column-header {
		padding: var(--spacing-md);
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-surface);
	}

	.column-header h4 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.column-header.planned {
		border-left: 4px solid var(--color-text-muted);
	}

	.column-header.planned h4 {
		color: var(--color-text-muted);
	}

	.column-header.in-progress {
		border-left: 4px solid var(--color-warning);
	}

	.column-header.in-progress h4 {
		color: var(--color-warning);
	}

	.column-header.done {
		border-left: 4px solid var(--color-success);
	}

	.column-header.done h4 {
		color: var(--color-success);
	}

	.task-count {
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 1.5rem;
		text-align: center;
	}

	.column-content {
		flex: 1;
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		overflow-y: auto;
	}

	.empty-column {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xl);
		text-align: center;
	}

	.empty-column p {
		margin: 0;
		color: var(--color-text-muted);
		font-style: italic;
	}

	@media (max-width: 768px) {
		.task-kanban {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}

		.column-content {
			max-height: 300px;
		}
	}
</style>
