<script lang="ts">
	import { Filter, ChevronDown, X } from '@lucide/svelte';
	import type { Goal } from '$lib/models/types';
	import { m } from '$lib/paraglide/messages';
	import { SvelteSet } from 'svelte/reactivity';

	type FilterState = {
		selectedGoals: Set<string>;
		selectedMilestones: Set<string>;
		selectedPriorities: Set<number>;
	};

	let {
		goals,
		filters = $bindable(),
		onFiltersChange
	}: {
		goals: Goal[];
		filters: FilterState;
		onFiltersChange: (filters: FilterState) => void;
	} = $props();

	// Local state for dropdown visibility
	let showGoalsDropdown = $state(false);
	let showMilestonesDropdown = $state(false);
	let showPriorityDropdown = $state(false);

	// Get available milestones based on selected goals
	const availableMilestones = $derived(() => {
		if (filters.selectedGoals.size === 0) {
			// If no goals selected, show all milestones
			return goals.flatMap((goal) =>
				goal.milestones.map((milestone) => ({ ...milestone, goalTitle: goal.title }))
			);
		}
		// Only show milestones from selected goals
		return goals
			.filter((goal) => filters.selectedGoals.has(goal.id))
			.flatMap((goal) =>
				goal.milestones.map((milestone) => ({ ...milestone, goalTitle: goal.title }))
			);
	});

	// Priority levels based on value/effort combinations
	const priorityLevels = [
		{ value: 5, label: m.quick_win(), color: 'var(--color-success)' },
		{ value: 4, label: m.strategic(), color: 'var(--color-primary)' },
		{ value: 2, label: m.consider(), color: 'var(--color-warning)' },
		{ value: 1, label: m.avoid(), color: 'var(--color-error)' }
	];

	function toggleGoal(goalId: string) {
		const newSelectedGoals = new SvelteSet(filters.selectedGoals);
		if (newSelectedGoals.has(goalId)) {
			newSelectedGoals.delete(goalId);
			// Remove milestones from this goal
			const goalMilestones =
				goals.find((goal) => goal.id === goalId)?.milestones.map((milestone) => milestone.id) || [];
			const newSelectedMilestones = new SvelteSet(filters.selectedMilestones);
			goalMilestones.forEach((id) => newSelectedMilestones.delete(id));
			filters = {
				...filters,
				selectedGoals: newSelectedGoals,
				selectedMilestones: newSelectedMilestones
			};
		} else {
			newSelectedGoals.add(goalId);
			filters = { ...filters, selectedGoals: newSelectedGoals };
		}
		onFiltersChange(filters);
	}

	function toggleMilestone(milestoneId: string) {
		const newSelectedMilestones = new SvelteSet(filters.selectedMilestones);
		if (newSelectedMilestones.has(milestoneId)) {
			newSelectedMilestones.delete(milestoneId);
		} else {
			newSelectedMilestones.add(milestoneId);
		}
		filters = { ...filters, selectedMilestones: newSelectedMilestones };
		onFiltersChange(filters);
	}

	function togglePriority(priority: number) {
		const newSelectedPriorities = new SvelteSet(filters.selectedPriorities);
		if (newSelectedPriorities.has(priority)) {
			newSelectedPriorities.delete(priority);
		} else {
			newSelectedPriorities.add(priority);
		}
		filters = { ...filters, selectedPriorities: newSelectedPriorities };
		onFiltersChange(filters);
	}

	function clearAllFilters() {
		filters = {
			selectedGoals: new Set(),
			selectedMilestones: new Set(),
			selectedPriorities: new Set()
		};
		onFiltersChange(filters);
	}

	// Close dropdowns when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.filter-dropdown')) {
			showGoalsDropdown = false;
			showMilestonesDropdown = false;
			showPriorityDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="filter-section">
	<div class="filter-header">
		<div class="filter-title">
			<Filter size={18} />
			<span>{m.filters()}</span>
		</div>
		{#if filters.selectedGoals.size > 0 || filters.selectedMilestones.size > 0 || filters.selectedPriorities.size > 0}
			<button class="clear-filters-btn" onclick={clearAllFilters}>
				<X size={16} />
				{m.clear_all()}
			</button>
		{/if}
	</div>

	<div class="filter-controls">
		<!-- Goals Filter -->
		<div class="filter-dropdown">
			<button
				class="filter-btn"
				class:active={filters.selectedGoals.size > 0}
				onclick={() => (showGoalsDropdown = !showGoalsDropdown)}
			>
				<span>
					{m.goals()}
					{#if filters.selectedGoals.size > 0}
						({filters.selectedGoals.size})
					{/if}
				</span>
				<ChevronDown size={16} class={showGoalsDropdown ? 'rotated' : ''} />
			</button>

			{#if showGoalsDropdown}
				<div class="dropdown-content">
					{#each goals as goal (goal.id)}
						<label class="dropdown-item">
							<input
								type="checkbox"
								checked={filters.selectedGoals.has(goal.id)}
								onchange={() => toggleGoal(goal.id)}
							/>
							<span class="goal-item">
								{#if goal.icon}
									<span class="goal-icon">{goal.icon}</span>
								{/if}
								<span class="goal-title">{goal.title}</span>
							</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Milestones Filter -->
		<div class="filter-dropdown">
			<button
				class="filter-btn"
				class:active={filters.selectedMilestones.size > 0}
				onclick={() => (showMilestonesDropdown = !showMilestonesDropdown)}
			>
				<span>
					{m.milestones()}
					{#if filters.selectedMilestones.size > 0}
						({filters.selectedMilestones.size})
					{/if}
				</span>
				<ChevronDown size={16} class={showMilestonesDropdown ? 'rotated' : ''} />
			</button>

			{#if showMilestonesDropdown}
				<div class="dropdown-content">
					{#each availableMilestones() as milestone (milestone.id)}
						<label class="dropdown-item">
							<input
								type="checkbox"
								checked={filters.selectedMilestones.has(milestone.id)}
								onchange={() => toggleMilestone(milestone.id)}
							/>
							<span class="milestone-item">
								<span class="milestone-title">{milestone.title}</span>
								{#if filters.selectedGoals.size === 0}
									<span class="milestone-goal">({milestone.goalTitle})</span>
								{/if}
							</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Priority Filter -->
		<div class="filter-dropdown">
			<button
				class="filter-btn"
				class:active={filters.selectedPriorities.size > 0}
				onclick={() => (showPriorityDropdown = !showPriorityDropdown)}
			>
				<span>
					{m.priority()}
					{#if filters.selectedPriorities.size > 0}
						({filters.selectedPriorities.size})
					{/if}
				</span>
				<ChevronDown size={16} class={showPriorityDropdown ? 'rotated' : ''} />
			</button>

			{#if showPriorityDropdown}
				<div class="dropdown-content">
					{#each priorityLevels as priority (priority.value)}
						<label class="dropdown-item">
							<input
								type="checkbox"
								checked={filters.selectedPriorities.has(priority.value)}
								onchange={() => togglePriority(priority.value)}
							/>
							<span class="priority-item">
								<span class="priority-indicator" style="background-color: {priority.color}"></span>
								<span class="priority-label">{priority.label}</span>
							</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.filter-section {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-lg);
		margin-bottom: var(--spacing-lg);
	}

	.filter-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-md);
	}

	.filter-title {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.clear-filters-btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background-color: var(--color-surface);
		color: var(--color-text-muted);
		font-size: 0.75rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.clear-filters-btn:hover {
		background-color: var(--color-surface-elevated);
		color: var(--color-text-secondary);
		border-color: var(--color-border-hover);
	}

	.filter-controls {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.filter-dropdown {
		position: relative;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-surface);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		min-width: 140px;
		justify-content: space-between;
		white-space: nowrap;
	}

	.filter-btn:hover {
		background-color: var(--color-surface-elevated);
		border-color: var(--color-border-hover);
	}

	.filter-btn.active {
		background-color: var(--color-primary-light);
		border-color: var(--color-primary);
		color: var(--color-primary-dark);
	}

	.filter-btn :global(.rotated) {
		transform: rotate(180deg);
	}

	.dropdown-content {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 10;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		margin-top: var(--spacing-xs);
		max-height: 300px;
		overflow-y: auto;
		min-width: 250px;
		white-space: nowrap;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.dropdown-item:hover {
		background-color: var(--color-surface);
	}

	.dropdown-item input[type='checkbox'] {
		margin: 0;
		flex-shrink: 0;
	}

	.goal-item,
	.milestone-item,
	.priority-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex: 1;
		min-width: 0;
	}

	.goal-icon {
		font-size: 1rem;
		flex-shrink: 0;
	}

	.goal-title,
	.milestone-title {
		font-weight: 500;
		color: var(--color-text-primary);
		white-space: nowrap;
	}

	.milestone-goal {
		color: var(--color-text-muted);
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.priority-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.priority-label {
		color: var(--color-text-primary);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.filter-section {
			padding: var(--spacing-md);
		}

		.filter-controls {
			gap: var(--spacing-xs);
			flex-direction: column;
		}

		.filter-btn {
			min-width: 120px;
			font-size: 0.8rem;
			padding: var(--spacing-xs) var(--spacing-sm);
			width: 100%;
		}

		.dropdown-content {
			max-height: 200px;
			min-width: 200px;
		}

		.milestone-item,
		.goal-item {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--spacing-xs);
		}

		.milestone-goal {
			margin-left: 0;
		}
	}
</style>
