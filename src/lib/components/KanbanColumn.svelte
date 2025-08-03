<script lang="ts">
	import type { Task, Milestone } from '$lib/models/types';
	import { TaskCard } from '$lib/components/Tasks';

	interface Props {
		title: string;
		tasks: Array<{ task: Task; milestone: Milestone }>;
		icon?: string;
		color?: string;
	}

	let { title, tasks, icon, color }: Props = $props();

	const taskCount = $derived(tasks.length);
</script>

<div class="kanban-column">
	<div class="column-header" style="--column-color: {color || 'var(--color-text-muted)'}">
		<div class="header-content">
			{#if icon}
				<span class="column-icon">{icon}</span>
			{/if}
			<h3 class="column-title">{title}</h3>
			<span class="task-count">{taskCount}</span>
		</div>
	</div>

	<div class="column-content">
		{#if tasks.length === 0}
			<div class="empty-column">
				<p>No tasks</p>
			</div>
		{:else}
			{#each tasks as { task, milestone } (task.id)}
				<TaskCard {task} {milestone} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.kanban-column {
		display: flex;
		flex-direction: column;
		min-width: 280px;
		max-width: 320px;
		height: calc(100vh - 10rem);
		background-color: var(--color-surface-elevated);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		user-select: none;
	}

	.column-header {
		padding: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-surface);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.column-icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.column-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
		flex: 1;
	}

	.task-count {
		background-color: var(--color-primary-light);
		color: var(--color-primary-dark);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-md);
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 24px;
		text-align: center;
	}

	.column-content {
		flex: 1;
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		overflow-y: auto;
		max-height: calc(100vh - 200px);
	}

	.empty-column {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xl);
		color: var(--color-text-muted);
		font-style: italic;
		background-color: var(--color-background);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-md);
		margin: var(--spacing-sm) 0;
	}

	.empty-column p {
		margin: 0;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.kanban-column {
			min-width: 240px;
			max-width: 280px;
		}

		.column-content {
			max-height: calc(100vh - 150px);
		}
	}
</style>
