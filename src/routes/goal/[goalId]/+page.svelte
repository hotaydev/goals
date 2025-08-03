<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Edit, Trash2, Plus } from '@lucide/svelte';
	import { goalsStore, goals, getGoal } from '$lib/stores/goalsStore';
	import { modalStore } from '$lib/stores/modalStore';
	import GoalHeader from '$lib/components/GoalHeader.svelte';
	import SMARTSection from '$lib/components/SMARTSection.svelte';
	import MilestoneCard from '$lib/components/MilestoneCard.svelte';
	import ModalManager from '$lib/components/ModalManager.svelte';
	import { calculatePriority } from '$lib/services/priority';
	import { getMilestoneCompletionPercentage } from '$lib/services/percentage';

	let loading = $state(true);
	let error = $state<string | null>(null);
	let goalId = $state<string>('');

	// Get goal reactively from store
	const goalStore = $derived(getGoal(goalId));
	const goal = $derived($goalStore);

	// Get URL parameters
	const urlParams = $derived(page.url.searchParams);
	const milestoneParam = $derived(urlParams.get('milestone'));
	const taskParam = $derived(urlParams.get('task'));

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

	onMount(() => {
		try {
			// Initialize the store
			goalsStore.init();

			const paramGoalId = page.params?.goalId;
			if (!paramGoalId) {
				error = 'Goal ID is required';
				return;
			}

			goalId = paramGoalId;
		} catch (err) {
			console.error('Failed to initialize goals store:', err);
			error = 'Failed to load goal';
		} finally {
			loading = false;
		}
	});

	// Check if goal exists
	$effect(() => {
		if (!loading && goalId && !goal) {
			error = 'Goal not found';
		}
	});

	// Handle URL parameters for opening specific items
	$effect(() => {
		if (!loading && goal && (milestoneParam || taskParam)) {
			// Clear URL parameters after processing
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.delete('milestone');
			newUrl.searchParams.delete('task');
			window.history.replaceState({}, '', newUrl.toString());

			if (taskParam) {
				// Find the milestone containing this task
				const milestone = goal.milestones.find((m) => m.tasks.some((t) => t.id === taskParam));
				if (milestone) {
					modalStore.openTaskModal(taskParam);
				}
			} else if (milestoneParam) {
				modalStore.openMilestoneModal(milestoneParam);
			}
		}
	});

	function handleGoBack() {
		goto('/');
	}

	function handleEditGoal() {
		if (goal) {
			modalStore.openGoalModal(goal.id);
		}
	}

	function handleDeleteGoal() {
		if (goal) {
			const confirmMessage = `Are you sure you want to delete the goal "${goal.title}"? This action cannot be undone and will also delete all associated milestones and tasks.`;
			modalStore.openDeleteConfirmationModal(
				'Delete Goal',
				confirmMessage,
				goal.title,
				'goal',
				() => {
					goalsStore.deleteGoal(goal.id);
					modalStore.closeDeleteConfirmationModal();
					// Navigate back to main page after deletion
					goto('/');
				}
			);
		}
	}

	function handleCreateMilestone() {
		if (goal) {
			modalStore.openCreateMilestoneModal(goal.id);
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
			<div class="milestones-header">
				<h2>Milestones</h2>
				<button
					class="btn btn-primary"
					onclick={handleCreateMilestone}
					title="Create new milestone"
				>
					<Plus size={16} />
					New Milestone
				</button>
			</div>
			<div class="milestones-list">
				{#each sortedMilestones as milestone (milestone.id)}
					<MilestoneCard {milestone} />
				{/each}
				{#if goal.milestones.length === 0}
					<div class="empty-state">
						<div class="empty-icon">🎯</div>
						<h3>No milestones yet</h3>
						<p>Create your first milestone to break down this goal into manageable steps.</p>
						<button class="btn btn-primary" onclick={handleCreateMilestone}>
							<Plus size={16} />
							Create First Milestone
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Modal Manager -->
	<ModalManager goals={$goals} />
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

	.milestones-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-md);
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

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--spacing-2xl);
		gap: var(--spacing-md);
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		border: 1px dashed var(--color-border);
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: var(--spacing-sm);
	}

	.empty-state h3 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
	}

	.empty-state p {
		margin: 0;
		color: var(--color-text-secondary);
		max-width: 400px;
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
