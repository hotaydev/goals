<script lang="ts">
	import type { TaskStatus } from '$lib/models/types';
	import { ChevronDown } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		status: TaskStatus;
		onStatusChange: (newStatus: TaskStatus) => void;
		size?: 'small' | 'medium';
	}

	let { status, onStatusChange, size = 'medium' }: Props = $props();

	let isOpen = $state(false);

	const statusOptions: { value: TaskStatus; label: string }[] = [
		{ value: 'planned', label: m.planned() },
		{ value: 'in_progress', label: m.in_progress() },
		{ value: 'done', label: m.done() }
	];

	const selectedOption = $derived(
		statusOptions.find((option) => option.value === status) || statusOptions[0]
	);

	function handleOptionClick(newStatus: TaskStatus) {
		if (newStatus !== status) {
			onStatusChange(newStatus);
		}
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.status-dropdown')) {
			isOpen = false;
		}
	}

	// Close dropdown when clicking outside
	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="status-dropdown" class:size-small={size === 'small'}>
	<button
		class="status-badge status-{status}"
		onclick={(e) => {
			e.stopPropagation();
			isOpen = !isOpen;
		}}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		{selectedOption.label}
		<ChevronDown size={size === 'small' ? 10 : 12} />
	</button>

	{#if isOpen}
		<div class="dropdown-menu">
			{#each statusOptions as option (option.value)}
				<button
					class="dropdown-option status-{option.value}"
					class:selected={option.value === status}
					onclick={() => handleOptionClick(option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.status-dropdown {
		position: relative;
		display: inline-block;
	}

	.status-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-md);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		cursor: pointer;
		background: none;
		outline: none;
	}

	.size-small .status-badge {
		padding: 2px var(--spacing-xs);
		font-size: 0.625rem;
		border-radius: var(--radius-sm);
	}

	.status-badge.status-planned {
		background-color: var(--color-text-muted);
		border: 2px solid var(--color-text-muted);
		color: white;
	}

	.status-badge.status-in_progress {
		background-color: var(--color-warning);
		border: 2px solid var(--color-warning);
		color: white;
	}

	.status-badge.status-done {
		background-color: var(--color-success);
		border: 2px solid var(--color-success);
		color: white;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		z-index: 1000;
		overflow: hidden;
		margin-top: 4px;
		min-width: 120px;
	}

	.dropdown-option {
		display: block;
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		text-align: left;
		border: none;
		background: none;
		color: var(--color-text-primary);
		cursor: pointer;
		transition: background-color var(--transition-fast);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		text-wrap: nowrap;
	}

	.dropdown-option:hover {
		background-color: var(--color-surface);
	}

	.dropdown-option.selected {
		background-color: var(--color-primary);
		color: white;
	}

	.dropdown-option.status-planned:hover:not(.selected) {
		background-color: var(--color-text-muted);
		color: white;
	}

	.dropdown-option.status-in_progress:hover:not(.selected) {
		background-color: var(--color-warning);
		color: white;
	}

	.dropdown-option.status-done:hover:not(.selected) {
		background-color: var(--color-success);
		color: white;
	}
</style>
