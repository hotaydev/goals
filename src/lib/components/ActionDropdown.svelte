<script lang="ts">
	import { MoreVertical, Edit, Trash2, Copy } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		onEdit?: () => void;
		onDelete?: () => void;
		onDuplicate?: () => void;
		deleteConfirmMessage?: string;
		itemName?: string;
		itemType?: 'goal' | 'milestone' | 'task';
	}

	let {
		onEdit,
		onDelete,
		onDuplicate,
		deleteConfirmMessage,
		itemName = 'item',
		itemType = 'task'
	}: Props = $props();

	let isOpen = $state(false);
	let dropdownElement: HTMLDivElement;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleEdit() {
		onEdit?.();
		isOpen = false;
	}

	function handleDuplicate() {
		onDuplicate?.();
		isOpen = false;
	}

	function handleDelete() {
		const itemTypeLabel =
			itemType === 'goal' ? m.goal() : itemType === 'milestone' ? m.milestone() : m.task();
		const message =
			deleteConfirmMessage ||
			m.are_you_sure_you_want_to_delete_this_item({ itemType: itemTypeLabel });
		const title = m.delete() + ' ' + itemTypeLabel;

		modalStore.openDeleteConfirmationModal(
			title,
			message,
			itemName,
			itemType as 'goal' | 'milestone' | 'task',
			() => {
				onDelete?.();
				modalStore.closeDeleteConfirmationModal();
			}
		);
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="action-dropdown" bind:this={dropdownElement}>
	<button class="action-trigger" onclick={toggleDropdown} title={m.more_actions()}>
		<MoreVertical size={16} />
	</button>

	{#if isOpen}
		<div class="dropdown-menu">
			{#if onEdit}
				<button class="dropdown-item" onclick={handleEdit}>
					<Edit size={14} />
					{m.edit()}
				</button>
			{/if}
			{#if onDuplicate}
				<button class="dropdown-item" onclick={handleDuplicate}>
					<Copy size={14} />
					{m.duplicate()}
				</button>
			{/if}
			{#if onDelete}
				<button class="dropdown-item delete" onclick={handleDelete}>
					<Trash2 size={14} />
					{m.delete()}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.action-dropdown {
		position: relative;
		display: inline-block;
	}

	.action-trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: none;
		background-color: transparent;
		color: var(--color-text-secondary);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-trigger:hover {
		background-color: var(--color-surface);
		color: var(--color-text-primary);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		min-width: 120px;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		overflow: hidden;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		background-color: transparent;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.dropdown-item:hover {
		background-color: var(--color-surface);
	}

	.dropdown-item.delete {
		color: var(--color-error);
	}

	.dropdown-item.delete:hover {
		background-color: var(--color-error-light);
		color: var(--color-error-dark);
	}

	@media (max-width: 768px) {
		.dropdown-menu {
			right: auto;
			left: 0;
		}
	}
</style>
