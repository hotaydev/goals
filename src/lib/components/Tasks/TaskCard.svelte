<script lang="ts">
	import type { Task, Milestone } from '$lib/models/types';
	import { calculatePriority, getEffortLabel, getPriorityLabel } from '$lib/services/priority';
	import { modalStore } from '$lib/stores/modalStore';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		task: Task;
		milestone: Milestone;
	}

	let { task, milestone }: Props = $props();

	const priority = $derived(calculatePriority(task.value, task.effort));
	const priorityLabel = $derived(getPriorityLabel(priority));
	const effortLabel = $derived(getEffortLabel(task.value, task.effort));

	function handleTaskClick() {
		modalStore.openTaskModal(task.id);
	}
</script>

<div
	class="task-card priority-{priority}"
	onclick={handleTaskClick}
	onkeydown={(e) => e.key === 'Enter' && handleTaskClick()}
	role="button"
	tabindex="0"
	title={m.click_to_view_task_details()}
>
	<div class="card-header">
		{#if task.icon}
			<span class="task-icon">{task.icon}</span>
		{/if}
		<h4 class="task-title">{task.title}</h4>
	</div>

	<div class="card-footer">
		<div class="milestone-info">
			<span class="milestone-icon">{milestone.icon || '🎯'}</span>
			<span class="milestone-title">{milestone.title}</span>
		</div>
		<div class="badges">
			<div class="priority-badge priority-{priority}" title={effortLabel}>
				{priorityLabel}
			</div>
			<div class="date-info">
				<TimeRemaining targetDate={task.targetDate} size="small" />
			</div>
		</div>
	</div>
</div>

<style>
	.task-card {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		min-height: 120px;
		user-select: none;
	}

	.task-card:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--color-border-hover);
		transform: translateY(-2px);
		background-color: var(--color-surface);
	}

	.task-card:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--spacing-sm);
	}

	.task-icon {
		font-size: 1.25rem;
		line-height: 1;
	}

	.priority-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: 0.625rem;
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

	.card-content {
		flex: 1;
		min-width: 0;
	}

	.task-title {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.card-footer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-xs);
	}

	.card-footer .badges {
		display: flex;
		align-items: space-between;
		gap: var(--spacing-xs);
	}

	.milestone-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.milestone-icon {
		font-size: 0.75rem;
		line-height: 1;
	}

	.milestone-title {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.date-info {
		display: flex;
		align-items: center;
		justify-content: flex-end;
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

	@media (max-width: 768px) {
		.task-card {
			min-height: 100px;
			padding: var(--spacing-sm);
		}

		.task-title {
			font-size: 0.8rem;
		}
	}
</style>
