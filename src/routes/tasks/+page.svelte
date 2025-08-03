<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { getAllTasksWithMilestones, goals } from '$lib/stores/goalsStore';
	import ModalManager from '$lib/components/ModalManager.svelte';
	import KanbanColumn from '$lib/components/KanbanColumn.svelte';
	import { calculateTimeRemaining } from '$lib/services/date';
	import type { Task, Milestone } from '$lib/models/types';
	import { calculatePriority } from '$lib/services/priority';

	// Get all tasks with their milestone information
	const allTasksWithMilestones = getAllTasksWithMilestones();

	// Define the columns configuration
	const columns = [
		{
			status: 'backlog',
			title: 'Backlog',
			icon: '📋',
			color: 'var(--color-text-muted)'
		},
		{
			status: 'planned',
			title: 'Planned',
			icon: '📅',
			color: 'var(--color-primary)'
		},
		{
			status: 'in_progress',
			title: 'In Progress',
			icon: '⚡',
			color: 'var(--color-warning)'
		},
		{
			status: 'done',
			title: 'Done',
			icon: '✅',
			color: 'var(--color-success)'
		}
	];

	// Group tasks by status
	const tasksByStatus = $derived(() => {
		const grouped: Record<string, Array<{ task: Task; milestone: Milestone }>> = {
			backlog: [],
			planned: [],
			in_progress: [],
			done: []
		};

		$allTasksWithMilestones.forEach(({ task, milestone }) => {
			// Map task status to column status
			let columnStatus: string = task.status;

			const timeRemaining = calculateTimeRemaining(task.targetDate);

			if (task.status === 'planned' && timeRemaining.category === 'plenty') {
				columnStatus = 'backlog';
			}

			grouped[columnStatus].push({ task, milestone });
		});

		return grouped;
	});

	// Get tasks for a specific status
	function getTasksForStatus(status: string) {
		const tasksForStatus = tasksByStatus()[status] || [];
		return tasksForStatus.sort((a, b) => {
			const priorityA = calculatePriority(a.task.value, a.task.effort);
			const priorityB = calculatePriority(b.task.value, b.task.effort);
			return priorityB - priorityA;
		});
	}
</script>

<div class="page-container">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<div class="header-top">
				<a href="/" class="btn btn-icon">
					<ArrowLeft size={20} />
				</a>
				<h1>Tasks Board</h1>
			</div>
			<p>Manage and organize your tasks in a comprehensive board view</p>
		</div>
	</div>

	<!-- Kanban Board -->
	<div class="kanban-board">
		{#each columns as column (column.status)}
			{@const tasks = getTasksForStatus(column.status)}
			<KanbanColumn title={column.title} {tasks} icon={column.icon} color={column.color} />
		{/each}
	</div>
</div>

<!-- Modal Manager for Task Modals -->
<ModalManager goals={$goals} />

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg) 0;
		flex-shrink: 0;
	}

	.header-content {
		flex: 1;
	}

	.header-top {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-sm);
	}

	.header-content h1 {
		margin: 0;
	}

	.header-content p {
		margin: 0;
	}

	.kanban-board {
		display: flex;
		gap: var(--spacing-sm);
		overflow-x: auto;
		padding: 0 var(--spacing-sm) var(--spacing-lg) var(--spacing-sm);
		flex: 1;
		min-height: 0;
	}

	/* Custom scrollbar for the kanban board */
	.kanban-board::-webkit-scrollbar {
		height: 8px;
	}

	.kanban-board::-webkit-scrollbar-track {
		background: var(--color-surface-elevated);
		border-radius: var(--radius-sm);
	}

	.kanban-board::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-sm);
	}

	.kanban-board::-webkit-scrollbar-thumb:hover {
		background: var(--color-border-hover);
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: stretch;
			padding: var(--spacing-md) 0;
		}

		.kanban-board {
			gap: var(--spacing-md);
			padding: 0 var(--spacing-xs) var(--spacing-md) var(--spacing-xs);
		}
	}
</style>
