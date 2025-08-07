<script lang="ts">
	import type { Goal } from '$lib/models/types';
	import { getGoalCompletionPercentage } from '$lib/services/percentage';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import TimeRemaining from '$lib/components/TimeRemaining.svelte';
	import CompletionBadge from '$lib/components/CompletionBadge.svelte';
	import { m } from '$lib/paraglide/messages';

	let {
		goal,
		onclick
	}: {
		goal: Goal;
		onclick?: () => void;
	} = $props();

	const completionPercentage = $derived(getGoalCompletionPercentage(goal.milestones));

	// Format the target date
	function formatTargetDate(targetDate: Goal['targetDate']): string {
		const { year, month, day } = targetDate;

		if (day && month) {
			return new Date(year, month - 1, day).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} else if (month) {
			return new Date(year, month - 1).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long'
			});
		} else {
			return year.toString();
		}
	}

	function handleClick() {
		if (onclick) {
			onclick();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<div
	class="card goal-card"
	onclick={handleClick}
	onkeydown={handleKeydown}
	tabindex="0"
	role="button"
	aria-label={m.view_goal({ title: goal.title })}
>
	<div class="goal-header">
		<div class="goal-icon">
			{goal.icon || '🎯'}
		</div>
		<div class="goal-info">
			<h3>{goal.title}</h3>
			<p>{goal.description}</p>
		</div>
	</div>

	<div class="goal-meta">
		<div class="goal-dates">
			{#if completionPercentage < 100}
				<TimeRemaining
					targetDate={goal.targetDate}
					size="medium"
					extraText={m.expected_by({ date: formatTargetDate(goal.targetDate) })}
				/>
			{:else}
				<CompletionBadge
					targetDate={goal.targetDate}
					size="medium"
					extraText={m.expected_by({ date: formatTargetDate(goal.targetDate) })}
				/>
			{/if}
		</div>

		<ProgressBar percentage={completionPercentage} size="md" />
	</div>
</div>

<style>
	.goal-card {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		transition: all var(--transition-fast);
	}

	.goal-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.goal-card:focus {
		outline: none;
		border: 2px solid var(--color-primary);
	}

	.goal-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.goal-icon {
		font-size: 2rem;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface-elevated);
		border-radius: var(--radius-lg);
		flex-shrink: 0;
	}

	.goal-info {
		flex: 1;
		min-width: 0; /* Allows text to truncate if needed */
	}

	.goal-info h3 {
		margin: 0;
		font-size: 1.125rem;
		line-height: 1.4;
	}

	.goal-info p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.4;
		color: var(--color-text-secondary);
	}

	.goal-meta {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.goal-dates {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}
</style>
