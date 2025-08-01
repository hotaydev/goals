<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { ArrowLeft, Edit, Trash2 } from '@lucide/svelte';
	import type { Goal } from '$lib/models/types';
	import { storageService } from '$lib/services/storage';
	import { modalStore } from '$lib/stores/modalStore';
	import GoalHeader from '$lib/components/GoalHeader.svelte';
	import SMARTSection from '$lib/components/SMARTSection.svelte';
	import MilestoneCard from '$lib/components/MilestoneCard.svelte';
	import ModalManager from '$lib/components/ModalManager.svelte';
	import { calculatePriority } from '$lib/services/priority';
	import { getMilestoneCompletionPercentage } from '$lib/services/percentage';

	let goal = $state<Goal | null>(null);
	let goals = $state<Goal[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Sort milestones by priority (highest first) then by completion percentage (Higher completion first - less work needed to complete)
	const sortedMilestones = $derived(
		goal
			? [...goal.milestones].sort((a, b) => {
					const priorityA = calculatePriority(a.value, a.effort);
					const priorityB = calculatePriority(b.value, b.effort);

					if (priorityA !== priorityB) {
						return priorityB - priorityA; // Higher priority first
					}

					const completionA = getMilestoneCompletionPercentage(a.tasks);
					const completionB = getMilestoneCompletionPercentage(b.tasks);

					return completionB - completionA; // Higher completion first (less work needed to complete)
				})
			: []
	);

	onMount(async () => {
		try {
			// Initialize storage with mock data if empty
			storageService.init();

			const goalId = page.params?.goalId;
			if (!goalId) {
				error = 'Goal ID is required';
				return;
			}

			// Load all goals for the ModalManager
			goals = storageService.getGoals();
			goal = storageService.getGoal(goalId);

			if (!goal) {
				error = 'Goal not found';
			}
		} catch (err) {
			console.error('Failed to load goal:', err);
			error = 'Failed to load goal';
		} finally {
			loading = false;
		}
	});

	// Reactively update data when storage changes (for real-time updates)
	function refreshData() {
		if (goal) {
			const updatedGoal = storageService.getGoal(goal.id);
			if (updatedGoal) {
				goal = updatedGoal;
			}
		}
		goals = storageService.getGoals();
	}

	// Listen for storage changes to update the UI
	if (typeof window !== 'undefined') {
		window.addEventListener('storage', refreshData);
	}

	function handleGoBack() {
		window.location.href = '/';
	}

	function handleEditGoal() {
		if (goal) {
			modalStore.openGoalModal(goal.id, 'edit');
		}
	}

	function handleDeleteGoal() {
		if (goal) {
			// TODO: Implement goal deletion with confirmation
			console.log('Delete goal:', goal.title);
		}
	}
</script>

{#if loading}
	<div class="loading-state">
		<div class="spinner"></div>
	</div>
{:else if error}
	<div class="error-state">
		<h2>Error</h2>
		<p>{error}</p>
		<button class="btn btn-primary" onclick={handleGoBack}>
			<ArrowLeft size={20} />
			Go Back
		</button>
	</div>
{:else if goal}
	<div class="goal-detail-page">
		<!-- Navigation Header -->
		<div class="nav-header">
			<button class="btn btn-icon" onclick={handleGoBack} title="Go back to goals">
				<ArrowLeft size={20} />
			</button>
			<div class="nav-title">
				<h1>{goal.title}</h1>
			</div>
			<div class="nav-actions">
				<button class="btn" onclick={handleEditGoal} title="Edit goal">
					<Edit size={16} />
					Edit
				</button>
				<button class="btn" onclick={handleDeleteGoal} title="Delete goal">
					<Trash2 size={16} />
					Delete
				</button>
			</div>
		</div>

		<!-- Goal Header -->
		<GoalHeader {goal} />

		<!-- SMART Criteria Section -->
		<SMARTSection smart={goal.smart} />

		<!-- Milestones Section -->
		<div class="milestones-section">
			<h2>Milestones</h2>
			<div class="milestones-list">
				{#each sortedMilestones as milestone (milestone.id)}
					<MilestoneCard {milestone} />
				{/each}
			</div>
		</div>
	</div>

	<!-- Modal Manager -->
	<ModalManager {goals} />
{/if}

<style>
	.goal-detail-page {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-lg);
	}

	.nav-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	.nav-title {
		flex: 1;
	}

	.nav-title h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.nav-actions {
		display: flex;
		gap: var(--spacing-sm);
	}

	.milestones-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.milestones-section h2 {
		margin: 0;
		color: var(--color-text-primary);
	}

	.milestones-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--spacing-2xl);
		gap: var(--spacing-md);
		min-height: 400px;
	}

	.error-state h2 {
		margin: 0;
		color: var(--color-error);
	}

	.error-state p {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-border);
		border-top: 3px solid var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.goal-detail-page {
			padding: var(--spacing-md);
		}

		.nav-header {
			flex-wrap: wrap;
		}

		.nav-actions {
			width: 100%;
			justify-content: flex-end;
		}
	}
</style>
