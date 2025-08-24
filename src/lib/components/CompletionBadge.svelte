<script lang="ts">
	import type { TargetDate } from '$lib/models/types';
	import { formatDate, formatTargetDate } from '$lib/services/date';
	import { CheckCircle } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		targetDate?: TargetDate;
		completedDate?: string;
		size?: 'small' | 'medium' | 'large';
		showIcon?: boolean;
		extraText?: string;
		completionText?: string;
	}

	let {
		targetDate,
		completedDate,
		size = 'medium',
		showIcon = true,
		extraText,
		completionText
	}: Props = $props();

	const displayText = $derived(() => {
		if (completionText) {
			return completionText;
		}
		if (completedDate) {
			const date = new Date(completedDate);
			return m.completed_on({ date: formatDate(date) });
		}
		return m.completed();
	});
</script>

<div
	class="completion-badge size-{size}"
	title={formatTargetDate(targetDate, { monthFormat: 'long' })}
>
	{#if showIcon}
		<CheckCircle
			class="completion-icon"
			size={size === 'small' ? 12 : size === 'medium' ? 14 : 16}
		/>
	{/if}
	<span class="completion-label">{displayText()}</span>
	{#if extraText}
		<span class="extra-text">•</span>
		<span class="extra-text">{extraText}</span>
	{/if}
</div>

<style>
	.completion-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-weight: 500;
		white-space: nowrap;
		transition: all var(--transition-fast);

		/* Neutral completion styling */
		background-color: rgba(71, 85, 105, 0.1);
		color: #475569;
		border: 1px solid rgba(71, 85, 105, 0.2);
	}

	/* Size variants */
	.size-small {
		font-size: 0.625rem;
		padding: 2px var(--spacing-xs);
		gap: 2px;
	}

	.size-medium {
		font-size: 0.75rem;
	}

	.size-large {
		font-size: 0.875rem;
		padding: var(--spacing-sm) var(--spacing-md);
	}

	/* Icon styling */
	:global(.completion-icon) {
		flex-shrink: 0;
	}

	.completion-label {
		font-weight: 600;
	}

	.extra-text {
		margin-left: 0.5rem;
		font-weight: 500;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.completion-badge {
			background-color: rgba(148, 163, 184, 0.15);
			color: #94a3b8;
			border: 1px solid rgba(148, 163, 184, 0.25);
		}
	}
</style>
