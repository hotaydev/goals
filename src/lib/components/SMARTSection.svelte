<script lang="ts">
	import type { SMARTCriteria } from '$lib/models/types';

	interface Props {
		smart: SMARTCriteria;
	}

	let { smart }: Props = $props();

	const smartLabels = {
		specific: 'Specific',
		measurable: 'Measurable',
		achievable: 'Achievable',
		relevant: 'Relevant',
		timeBound: 'Time-Bound'
	};
</script>

<div class="smart-section">
	<h2>SMART Goals Criteria</h2>
	<div class="smart-grid">
		{#each Object.entries(smart) as [key, value] (key)}
			<div class="smart-item">
				<div class="smart-header">
					<div class="smart-letter">{key.charAt(0).toUpperCase()}</div>
					<h3>{smartLabels[key as keyof SMARTCriteria]}</h3>
				</div>
				<p class="smart-description">{value}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.smart-section {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--spacing-xl);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.smart-section h2 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.5rem;
	}

	.smart-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-lg);
	}

	.smart-item {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-lg);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.smart-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.smart-letter {
		width: 2.5rem;
		height: 2.5rem;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.smart-item h3 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.125rem;
	}

	.smart-description {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.smart-section {
			padding: var(--spacing-lg);
		}

		.smart-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}

		.smart-item {
			padding: var(--spacing-md);
		}
	}
</style>
