<script lang="ts">
	import type { Goal } from '$lib/models/types';
	import { getGoalCompletionPercentage } from '$lib/services/percentage';
	import { formatTargetDate } from '$lib/services/date';
	import ProgressBar from './ProgressBar.svelte';

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
				<h1>{goal.title}</h1>
				<p class="goal-description">{goal.description}</p>
			</div>
		</div>

		<div class="goal-meta">
			<div class="target-date">
				<span class="label">Target Date:</span>
				<span class="value">{formatTargetDate(goal.targetDate, { monthFormat: 'long' })}</span>
			</div>
		</div>
	</div>

	<div class="goal-progress">
		<h3>Overall Progress</h3>
		<ProgressBar percentage={completionPercentage} size="lg" />
	</div>
</div>

<style>
	.goal-header {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-xl);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
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

	.goal-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-lg);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border);
	}

	.target-date {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
	}

	.label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.value {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.goal-progress {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.goal-progress h3 {
		margin: 0;
		font-size: 1.125rem;
		color: var(--color-text-primary);
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

		.goal-meta {
			justify-content: center;
		}
	}
</style>
