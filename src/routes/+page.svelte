<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GoalCard from '$lib/components/GoalCard.svelte';
	import ModalManager from '$lib/components/ModalManager.svelte';
	import type { Goal } from '$lib/models/types';
	import { goalsStore, goals } from '$lib/stores/goalsStore';
	import { modalStore } from '$lib/stores/modalStore';

	let loading = $state(true);

	onMount(() => {
		try {
			// Initialize the store
			goalsStore.init();
		} catch (error) {
			console.error('Failed to initialize goals store:', error);
		} finally {
			loading = false;
		}
	});

	function handleAddGoal() {
		modalStore.openGoalCreationModal();
	}

	function handleGoalClick(goal: Goal) {
		// Navigate to goal detail page
		goto(`/goal/${goal.id}`);
	}
</script>

<div class="page-container">
	<!-- Goals Grid -->
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
		</div>
	{:else if $goals.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🎯</div>
			<h3>No goals yet</h3>
			<p>Create your first long-term goal to get started on your journey.</p>
			<button class="btn btn-primary" onclick={handleAddGoal}>
				<Plus size={20} />
				Create Your First Goal
			</button>
		</div>
	{:else}
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1>My Goals</h1>
				<p>
					Track your long-term goals with SMART methodology and value vs effort matrix
					prioritization
				</p>
			</div>
			<button class="btn btn-primary" onclick={handleAddGoal}>
				<Plus size={20} />
				Add New Goal
			</button>
		</div>
		<div class="goals-grid">
			{#each $goals as goal (goal.id)}
				<GoalCard {goal} onclick={() => handleGoalClick(goal)} />
			{/each}
		</div>
	{/if}
</div>

<!-- Modal Manager -->
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
	}

	.header-content {
		flex: 1;
	}

	.header-content h1 {
		margin: 0 0 var(--spacing-sm) 0;
	}

	.header-content p {
		margin: 0;
	}

	.goals-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: var(--spacing-lg);
	}

	.loading-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--spacing-2xl);
		gap: var(--spacing-md);
		margin-top: calc(var(--spacing-2xl) * 2);
	}

	.empty-icon {
		font-size: 4rem;
		opacity: 0.5;
	}

	.empty-state h3 {
		margin: 0;
		color: var(--color-text-primary);
	}

	.empty-state p {
		margin: 0;
		max-width: 400px;
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
		.page-header {
			flex-direction: column;
			align-items: stretch;
		}

		.goals-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
