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

<div class="smart-section-compact">
	<h3>SMART Goals Criteria</h3>
	<div class="smart-grid-compact">
		{#each Object.entries(smart) as [key, value] (key)}
			<div class="smart-item-compact">
				<div class="smart-header-compact">
					<div class="smart-letter-compact">{key.charAt(0).toUpperCase()}</div>
					<h4>{smartLabels[key as keyof SMARTCriteria]}</h4>
				</div>
				<p class="smart-description-compact">{value}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.smart-section-compact {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.smart-section-compact h3 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.125rem;
	}

	.smart-grid-compact {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--spacing-sm);
	}

	.smart-item-compact {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: var(--spacing-sm);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.smart-header-compact {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.smart-letter-compact {
		width: 1.75rem;
		height: 1.75rem;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.smart-item-compact h4 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.smart-description-compact {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	@media (max-width: 768px) {
		.smart-grid-compact {
			grid-template-columns: 1fr;
		}

		.smart-item-compact {
			padding: var(--spacing-xs);
		}
	}
</style>
