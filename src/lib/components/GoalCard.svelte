<script lang="ts">
	import type { Goal, GoalCardProps } from '$lib/models/types';
	import { getGoalCompletionPercentage } from '$lib/services/percentage';

	let { goal, onclick }: GoalCardProps = $props();

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
	aria-label="View goal: {goal.title}"
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
		<div class="goal-date">
			Target: {formatTargetDate(goal.targetDate)}
		</div>
		<div class="progress-section">
			<div class="progress-bar">
				<div
					class="progress-fill"
					style="width: {getGoalCompletionPercentage(goal.milestones)}%"
				></div>
			</div>
			<span class="progress-text">{getGoalCompletionPercentage(goal.milestones)}% Complete</span>
		</div>
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
	}

	.goal-header {
		display: flex;
		align-items: center;
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

	.goal-date {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.progress-section {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.progress-bar {
		flex: 1;
		height: 0.5rem;
		background-color: var(--color-surface-elevated);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-primary);
		transition: width var(--transition-normal);
		border-radius: var(--radius-sm);
	}

	.progress-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
		font-weight: 500;
	}
</style>
