<script lang="ts">
	import { ArrowLeft, Filter } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { getAllTasksWithMilestones, goals } from '$lib/stores/goalsStore';
	import ModalManager from '$lib/components/ModalManager.svelte';
	import KanbanColumn from '$lib/components/KanbanColumn.svelte';
	import FilterSection from '$lib/components/Tasks/FilterSection.svelte';
	import { calculateTimeRemaining } from '$lib/services/date';
	import type { Task, Milestone } from '$lib/models/types';
	import { calculatePriority } from '$lib/services/priority';
	import { m } from '$lib/paraglide/messages';

	// Get all tasks with their milestone information
	const allTasksWithMilestones = getAllTasksWithMilestones();

	// Filter state
	type FilterState = {
		selectedGoals: Set<string>;
		selectedMilestones: Set<string>;
		selectedPriorities: Set<number>;
	};

	let filters = $state<FilterState>({
		selectedGoals: new Set(),
		selectedMilestones: new Set(),
		selectedPriorities: new Set()
	});

	// Filter visibility state - show by default if filters are active
	let showFilters = $state(false);

	// Check if any filters are active
	const hasActiveFilters = $derived(() => {
		return (
			filters.selectedGoals.size > 0 ||
			filters.selectedMilestones.size > 0 ||
			filters.selectedPriorities.size > 0
		);
	});

	function handleFiltersChange(newFilters: FilterState) {
		filters = newFilters;
	}

	function toggleFilters() {
		showFilters = !showFilters;
	}

	// Define the columns configuration
	const columns = [
		{
			status: 'backlog',
			title: m.kanban_columns_backlog(),
			icon: '📋',
			color: 'var(--color-text-muted)'
		},
		{
			status: 'planned',
			title: m.kanban_columns_planned(),
			icon: '📅',
			color: 'var(--color-primary)'
		},
		{
			status: 'in_progress',
			title: m.kanban_columns_in_progress(),
			icon: '⚡',
			color: 'var(--color-warning)'
		},
		{
			status: 'done',
			title: m.kanban_columns_done(),
			icon: '✅',
			color: 'var(--color-success)'
		}
	];

	// Filter tasks based on current filters
	const filteredTasksWithMilestones = $derived(() => {
		return $allTasksWithMilestones.filter(({ task, milestone }) => {
			// Find the goal for this milestone
			const goal = $goals.find((g) => g.milestones.some((m) => m.id === milestone.id));
			if (!goal) return false;

			// Filter by selected goals
			if (filters.selectedGoals.size > 0 && !filters.selectedGoals.has(goal.id)) {
				return false;
			}

			// Filter by selected milestones
			if (filters.selectedMilestones.size > 0 && !filters.selectedMilestones.has(milestone.id)) {
				return false;
			}

			// Filter by selected priorities
			if (filters.selectedPriorities.size > 0) {
				const taskPriority = calculatePriority(task.value, task.effort);
				if (!filters.selectedPriorities.has(taskPriority)) {
					return false;
				}
			}

			return true;
		});
	});

	// Group tasks by status
	const tasksByStatus = $derived(() => {
		const grouped: Record<string, Array<{ task: Task; milestone: Milestone }>> = {
			backlog: [],
			planned: [],
			in_progress: [],
			done: []
		};

		filteredTasksWithMilestones().forEach(({ task, milestone }) => {
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
				<h1>{m.tasks_board()}</h1>
			</div>
			<p>{m.tasks_board_description()}</p>
		</div>
		<div class="header-actions">
			<button
				class="btn btn-icon filter-toggle-btn"
				class:active={showFilters || hasActiveFilters()}
				onclick={toggleFilters}
				title={showFilters ? 'Hide filters' : 'Show filters'}
			>
				<Filter size={20} />
				{#if hasActiveFilters()}
					<span class="filter-indicator"></span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Filters -->
	{#if showFilters}
		<div transition:slide={{ duration: 300, axis: 'y' }}>
			<FilterSection goals={$goals} bind:filters onFiltersChange={handleFiltersChange} />
		</div>
	{/if}

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

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex-shrink: 0;
	}

	.filter-toggle-btn {
		position: relative;
		transition: all var(--transition-fast);
	}

	.filter-toggle-btn.active {
		background-color: var(--color-primary-light);
		border-color: var(--color-primary);
		color: var(--color-primary-dark);
	}

	.filter-indicator {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 8px;
		height: 8px;
		background-color: var(--color-primary);
		border-radius: 50%;
		border: 2px solid var(--color-background);
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
			flex-direction: row;
			align-items: flex-start;
			padding: var(--spacing-md) 0;
		}

		.header-content {
			flex: 1;
		}

		.header-actions {
			margin-top: var(--spacing-xs);
		}

		.kanban-board {
			gap: var(--spacing-md);
			padding: 0 var(--spacing-xs) var(--spacing-md) var(--spacing-xs);
		}
	}
</style>
