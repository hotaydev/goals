<script lang="ts">
	import { X, AlertTriangle } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		show: boolean;
		onDismiss: () => void;
	}

	let { show, onDismiss }: Props = $props();

	function handleDismiss() {
		onDismiss();
	}
</script>

{#if show}
	<div class="safety-backup-hint">
		<div class="safety-backup-hint-arrow"></div>
		<div class="safety-backup-hint-content">
			<div class="safety-backup-hint-header">
				<div class="safety-backup-hint-icon">
					<AlertTriangle size={18} />
				</div>
				<h3 class="safety-backup-hint-title">{m.safety_backup_hint_title()}</h3>
				<button
					class="safety-backup-hint-close"
					onclick={handleDismiss}
					title={m.backup_hint_close()}
				>
					<X size={16} />
				</button>
			</div>
			<p class="safety-backup-hint-message">{m.safety_backup_hint_message()}</p>
			<div class="safety-backup-hint-actions">
				<button class="safety-backup-hint-dismiss" onclick={handleDismiss}>
					{m.safety_backup_hint_dismiss()}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.safety-backup-hint {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		width: 300px;
		background: #fffbeb;
		border: 1px solid #fbbf24;
		border-radius: var(--radius-md);
		box-shadow: 0 8px 24px rgba(251, 191, 36, 0.15);
		z-index: 1000;
		overflow: hidden;
		animation: slideIn 0.2s ease-out;
	}

	.safety-backup-hint-arrow {
		position: absolute;
		top: -8px;
		right: 12px;
		width: 16px;
		height: 16px;
		background: #fffbeb;
		border: 1px solid #fbbf24;
		border-bottom: none;
		border-right: none;
		transform: rotate(45deg);
	}

	.safety-backup-hint-content {
		position: relative;
		padding: var(--spacing-md);
	}

	.safety-backup-hint-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-sm);
	}

	.safety-backup-hint-icon {
		color: #d97706;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.safety-backup-hint-title {
		flex: 1;
		font-size: 0.875rem;
		font-weight: 600;
		color: #92400e;
		margin: 0;
		line-height: 1.3;
	}

	.safety-backup-hint-close {
		background: none;
		border: none;
		color: #92400e;
		cursor: pointer;
		padding: 2px;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.safety-backup-hint-close:hover {
		background: rgba(251, 191, 36, 0.2);
		opacity: 1;
	}

	.safety-backup-hint-message {
		font-size: 0.75rem;
		color: #a16207;
		line-height: 1.4;
		margin: 0 0 var(--spacing-md) 0;
	}

	.safety-backup-hint-actions {
		display: flex;
		justify-content: flex-end;
	}

	.safety-backup-hint-dismiss {
		background: #fbbf24;
		color: #ffffff;
		border: none;
		padding: var(--spacing-xs) var(--spacing-md);
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.safety-backup-hint-dismiss:hover {
		background: #f59e0b;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 480px) {
		.safety-backup-hint {
			width: 280px;
			right: -20px;
		}

		.safety-backup-hint-arrow {
			right: 32px;
		}
	}
</style>
