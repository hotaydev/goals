<script lang="ts">
	interface Props {
		percentage: number;
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
		color?: 'primary' | 'success' | 'warning' | 'error';
	}

	let { percentage, size = 'md', showLabel = true, color = 'primary' }: Props = $props();

	// Ensure percentage is between 0 and 100
	const clampedPercentage = $derived(Math.min(Math.max(percentage, 0), 100));
</script>

<div class="progress-container {size}">
	{#if showLabel}
		<div class="progress-label">
			<span class="percentage">{clampedPercentage.toFixed(1)}%</span>
		</div>
	{/if}
	<div class="progress-bar">
		<div class="progress-fill {color}" style="width: {clampedPercentage}%"></div>
	</div>
</div>

<style>
	.progress-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		width: 100%;
	}

	.progress-container.sm {
		font-size: 0.75rem;
	}

	.progress-container.md {
		font-size: 0.875rem;
	}

	.progress-container.lg {
		font-size: 1rem;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: inherit;
		font-weight: 500;
	}

	.percentage {
		color: var(--color-text-primary);
	}

	.progress-bar {
		width: 100%;
		background-color: var(--color-surface-elevated);
		border-radius: var(--radius-sm);
		overflow: hidden;
		transition: background-color var(--transition-fast);
	}

	.progress-container.sm .progress-bar {
		height: 0.375rem;
	}

	.progress-container.md .progress-bar {
		height: 0.5rem;
	}

	.progress-container.lg .progress-bar {
		height: 0.75rem;
	}

	.progress-fill {
		height: 100%;
		transition: width var(--transition-normal);
		border-radius: var(--radius-sm);
	}

	.progress-fill.primary {
		background-color: var(--color-primary);
	}

	.progress-fill.success {
		background-color: var(--color-success);
	}

	.progress-fill.warning {
		background-color: var(--color-warning);
	}

	.progress-fill.error {
		background-color: var(--color-error);
	}
</style>
