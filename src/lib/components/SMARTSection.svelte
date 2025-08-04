<script lang="ts">
	import type { SMARTCriteria } from '$lib/models/types';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		smart: SMARTCriteria;
		defaultExpanded?: boolean;
		compact?: boolean;
	}

	let { smart, defaultExpanded = true, compact = false }: Props = $props();

	let isExpanded = $state(defaultExpanded);

	const smartLabels = {
		specific: m.smart_label_specific(),
		measurable: m.smart_label_measurable(),
		achievable: m.smart_label_achievable(),
		relevant: m.smart_label_relevant(),
		timeBound: m.smart_label_time_bound()
	};

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}
</script>

<div class="smart-section" class:compact>
	<button type="button" class="smart-header-button" onclick={toggleExpanded}>
		<h3>{m.smart_goals_criteria()}</h3>
		<div class="expand-icon" class:expanded={isExpanded}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</div>
	</button>

	{#if isExpanded}
		<div class="smart-content">
			{#each Object.entries(smart) as [key, value] (key)}
				<div class="smart-item">
					<div class="smart-header">
						<div class="smart-letter">{key.charAt(0).toUpperCase()}</div>
						<h4>{smartLabels[key as keyof SMARTCriteria]}</h4>
					</div>
					<p class="smart-description">{value}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.smart-section {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.smart-section.compact {
		border-radius: var(--radius-sm);
	}

	.smart-header-button {
		width: 100%;
		background: none;
		border: none;
		padding: var(--spacing-lg);
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.smart-header-button:hover {
		background-color: var(--color-background);
	}

	.smart-section.compact .smart-header-button {
		padding: var(--spacing-md);
	}

	.smart-header-button h3 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.smart-section.compact .smart-header-button h3 {
		font-size: 1rem;
	}

	.expand-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-text-secondary);
		transition: transform 0.2s ease;
	}

	.expand-icon.expanded {
		transform: rotate(180deg);
	}

	.expand-icon svg {
		width: 100%;
		height: 100%;
	}

	.smart-content {
		border-top: 1px solid var(--color-border);
		padding: var(--spacing-lg);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.smart-section.compact .smart-content {
		padding: var(--spacing-md);
		gap: var(--spacing-sm);
	}

	.smart-item {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.smart-section.compact .smart-item {
		padding: var(--spacing-sm);
		gap: var(--spacing-xs);
	}

	.smart-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.smart-section.compact .smart-header {
		gap: var(--spacing-sm);
	}

	.smart-letter {
		width: 2rem;
		height: 2rem;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.smart-section.compact .smart-letter {
		width: 1.5rem;
		height: 1.5rem;
		font-size: 0.875rem;
	}

	.smart-item h4 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1rem;
		font-weight: 600;
	}

	.smart-section.compact .smart-item h4 {
		font-size: 0.875rem;
	}

	.smart-description {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.5;
		font-size: 0.9rem;
	}

	.smart-section.compact .smart-description {
		font-size: 0.8rem;
		line-height: 1.4;
	}

	@media (max-width: 768px) {
		.smart-header-button {
			padding: var(--spacing-md);
		}

		.smart-content {
			padding: var(--spacing-md);
		}

		.smart-item {
			padding: var(--spacing-sm);
		}
	}
</style>
