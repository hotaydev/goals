<script lang="ts">
	import { Upload, Target, Flag, CheckSquare } from '@lucide/svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		isOpen: boolean;
		title: string;
		message: string;
		goalsCount: number;
		milestonesCount: number;
		tasksCount: number;
		onConfirm: () => void;
		onCancel: () => void;
		isProcessing?: boolean;
	}

	let {
		isOpen,
		title,
		message,
		goalsCount,
		milestonesCount,
		tasksCount,
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
	<div class="import-confirmation-content">
		<div class="import-section">
			<div class="import-icon">
				<Upload size={48} />
			</div>
			<div class="import-text">
				<h3>{m.backup_import_confirmation_title()}</h3>
				<p class="action-description">{m.backup_import_confirmation_message()}</p>
			</div>
		</div>

		<div class="message-section">
			<p class="warning-message">{message}</p>
		</div>

		<div class="stats-section">
			<h4>{m.backup_import_confirmation_file_contains()}</h4>
			<div class="stats-grid">
				<div class="stat-item">
					<Target size={20} />
					<span class="stat-number">{goalsCount}</span>
					<span class="stat-label">{goalsCount !== 1 ? m.goals() : m.goal()}</span>
				</div>
				<div class="stat-item">
					<Flag size={20} />
					<span class="stat-number">{milestonesCount}</span>
					<span class="stat-label">{milestonesCount !== 1 ? m.milestones() : m.milestone()}</span>
				</div>
				<div class="stat-item">
					<CheckSquare size={20} />
					<span class="stat-number">{tasksCount}</span>
					<span class="stat-label">{tasksCount !== 1 ? m.tasks() : m.task()}</span>
				</div>
			</div>
		</div>

		<div class="actions-section">
			<button
				class="btn btn-secondary"
				onclick={handleCancel}
				disabled={isProcessing}
				type="button"
			>
				{m.cancel()}
			</button>
			<button class="btn btn-primary" onclick={handleConfirm} disabled={isProcessing} type="button">
				{isProcessing ? m.importing() : m.import_data()}
			</button>
		</div>
	</div>
</Modal>

<style>
	.import-confirmation-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
		min-width: 450px;
		max-width: 550px;
	}

	.import-section {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.import-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background-color: var(--color-primary-light);
		border-radius: 50%;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.import-text {
		flex: 1;
	}

	.import-text h3 {
		margin: 0 0 var(--spacing-xs) 0;
		color: var(--color-text-primary);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.action-description {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 1rem;
		font-weight: 500;
	}

	.message-section {
		background-color: var(--color-warning-light);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
	}

	.warning-message {
		margin: 0;
		color: var(--color-warning-dark);
		line-height: 1.5;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.stats-section {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
	}

	.stats-section h4 {
		margin: 0 0 var(--spacing-sm) 0;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm);
		background-color: var(--color-background);
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}

	.stat-item :global(svg) {
		color: var(--color-primary);
	}

	.stat-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
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
		min-width: 120px;
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

	.btn-primary {
		background-color: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.btn-primary:hover:not(:disabled) {
		background-color: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
	}

	@media (max-width: 768px) {
		.import-confirmation-content {
			min-width: auto;
			max-width: 100%;
			padding: var(--spacing-md);
		}

		.import-section {
			flex-direction: column;
			text-align: center;
			gap: var(--spacing-sm);
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
		}

		.stat-item {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.actions-section {
			flex-direction: column-reverse;
		}

		.btn {
			width: 100%;
		}
	}
</style>
