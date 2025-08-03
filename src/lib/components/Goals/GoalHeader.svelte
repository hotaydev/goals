<script lang="ts">
	import type { Goal } from '$lib/models/types';
	import { getGoalCompletionPercentage } from '$lib/services/percentage';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';

	let { goal }: { goal: Goal } = $props();

	const completionPercentage = $derived(getGoalCompletionPercentage(goal.milestones));
</script>

<div class="goal-header">
	<div class="goal-info">
		<div class="goal-title-section">
			{#if goal.icon}
				<div class="goal-icon">{goal.icon}</div>
			{/if}
			<div class="goal-text">
				<div class="goal-title-section">
					<h1>{goal.title}</h1>
					<TimeRemaining targetDate={goal.targetDate} size="large" />
				</div>
				<p class="goal-description">{goal.description}</p>
			</div>
		</div>
	</div>

	<ProgressBar percentage={completionPercentage} size="lg" />
</div>

<style>
	.goal-header {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-xl);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.goal-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.goal-title-section {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.goal-icon {
		font-size: 3rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.goal-text {
		flex: 1;
		min-width: 0;
	}

	.goal-text h1 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: 2rem;
		color: var(--color-text-primary);
		word-wrap: break-word;
	}

	.goal-description {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 1.125rem;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.goal-header {
			padding: var(--spacing-lg);
		}

		.goal-title-section {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.goal-text h1 {
			font-size: 1.75rem;
		}

		.goal-description {
			font-size: 1rem;
		}
	}
</style>
