<script lang="ts">
	import { AlertTriangle } from '@lucide/svelte';
	import Modal from './Modal.svelte';

	interface Props {
		isOpen: boolean;
		title: string;
		message: string;
		itemName: string;
		itemType: 'goal' | 'milestone' | 'task';
		onConfirm: () => void;
		onCancel: () => void;
		isProcessing?: boolean;
	}

	let {
		isOpen,
		title,
		message,
		itemName,
		itemType,
		onConfirm,
		onCancel,
		isProcessing = false
	}: Props = $props();

	function handleConfirm() {
		if (!isProcessing) {
			onConfirm();
		}
	}

	function handleCancel() {
		if (!isProcessing) {
			onCancel();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !isProcessing) {
			handleConfirm();
		} else if (event.key === 'Escape' && !isProcessing) {
			handleCancel();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Modal {isOpen} onClose={handleCancel} {title}>
	<div class="delete-confirmation-content">
		<div class="warning-section">
			<div class="warning-icon">
				<AlertTriangle size={48} />
			</div>
			<div class="warning-text">
				<h3>Delete {itemType}</h3>
				<p class="item-name">"{itemName}"</p>
			</div>
		</div>

		<div class="message-section">
			<p class="warning-message">{message}</p>
		</div>

		<div class="actions-section">
			<button
				class="btn btn-secondary"
				onclick={handleCancel}
				disabled={isProcessing}
				type="button"
			>
				Cancel
			</button>
			<button class="btn btn-danger" onclick={handleConfirm} disabled={isProcessing} type="button">
				{isProcessing ? 'Deleting...' : `Delete ${itemType}`}
			</button>
		</div>
	</div>
</Modal>

<style>
	.delete-confirmation-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
		min-width: 400px;
		max-width: 500px;
	}

	.warning-section {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.warning-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background-color: var(--color-error-light);
		border-radius: 50%;
		color: var(--color-error);
		flex-shrink: 0;
	}

	.warning-text {
		flex: 1;
	}

	.warning-text h3 {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.item-name {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 1rem;
		font-weight: 500;
		font-style: italic;
	}

	.message-section {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
	}

	.warning-message {
		margin: 0;
		color: var(--color-text-primary);
		line-height: 1.5;
		font-size: 0.875rem;
	}

	.actions-section {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border);
	}

	.btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 100px;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background-color: var(--color-background);
		color: var(--color-text-secondary);
		border-color: var(--color-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background-color: var(--color-surface);
		border-color: var(--color-text-muted);
		color: var(--color-text-primary);
	}

	.btn-danger {
		background-color: var(--color-error);
		color: white;
		border-color: var(--color-error);
	}

	.btn-danger:hover:not(:disabled) {
		background-color: var(--color-error-dark);
		border-color: var(--color-error-dark);
	}

	@media (max-width: 768px) {
		.delete-confirmation-content {
			min-width: auto;
			max-width: 100%;
			padding: var(--spacing-md);
		}

		.warning-section {
			flex-direction: column;
			text-align: center;
			gap: var(--spacing-sm);
		}

		.actions-section {
			flex-direction: column-reverse;
		}

		.btn {
			width: 100%;
		}
	}
</style>
