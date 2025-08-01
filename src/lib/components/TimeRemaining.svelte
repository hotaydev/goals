<script lang="ts">
	import type { TargetDate } from '$lib/models/types';
	import { calculateTimeRemaining } from '$lib/services/date';
	import { Clock, AlertTriangle, CheckCircle } from '@lucide/svelte';

	interface Props {
		targetDate?: TargetDate;
		size?: 'small' | 'medium' | 'large';
		showIcon?: boolean;
		extraText?: string;
	}

	let { targetDate, size = 'medium', showIcon = true, extraText }: Props = $props();

	const timeRemaining = $derived(calculateTimeRemaining(targetDate));

	const icon = $derived(() => {
		switch (timeRemaining.category) {
			case 'overdue':
			case 'critical':
				return AlertTriangle;
			case 'close':
			case 'soon':
				return Clock;
			case 'plenty':
				return CheckCircle;
			default:
				return Clock;
		}
	});
</script>

<div class="time-remaining time-{timeRemaining.category} size-{size}">
	{#if showIcon}
		{@const IconComponent = icon()}
		<IconComponent class="time-icon" size={size === 'small' ? 12 : size === 'medium' ? 14 : 16} />
	{/if}
	<span class="time-label">{timeRemaining.label}</span>
	{#if extraText}
		<span class="extra-text">•</span>
		<span class="extra-text">{extraText}</span>
	{/if}
</div>

<style>
	.time-remaining {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-weight: 500;
		white-space: nowrap;
		transition: all var(--transition-fast);
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

	/* Category styling */
	.time-overdue {
		background-color: rgba(239, 68, 68, 0.1);
		color: var(--color-error);
		border: 1px solid rgba(239, 68, 68, 0.2);
	}

	.time-critical {
		background-color: rgba(245, 101, 101, 0.1);
		color: #dc2626;
		border: 1px solid rgba(245, 101, 101, 0.2);
	}

	.time-close {
		background-color: rgba(245, 158, 11, 0.1);
		color: var(--color-warning);
		border: 1px solid rgba(245, 158, 11, 0.2);
	}

	.time-soon {
		background-color: rgba(59, 130, 246, 0.1);
		color: var(--color-primary);
		border: 1px solid rgba(59, 130, 246, 0.2);
	}

	.time-plenty {
		background-color: rgba(34, 197, 94, 0.1);
		color: var(--color-success);
		border: 1px solid rgba(34, 197, 94, 0.2);
	}

	/* Icon styling */
	:global(.time-icon) {
		flex-shrink: 0;
	}

	.time-label {
		font-weight: 600;
	}

	.extra-text {
		margin-left: 0.5rem;
		font-weight: 500;
	}
</style>
