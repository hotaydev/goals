<script lang="ts">
	import { X, Info } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		show: boolean;
		onDismiss: () => void;
	}

	let { show, onDismiss }: Props = $props();

	const STORAGE_KEY = 'backup-hint-dismissed';

	// Check if hint was previously dismissed
	function isHintDismissed(): boolean {
		if (!browser) return false;
		try {
			return localStorage.getItem(STORAGE_KEY) === 'true';
		} catch {
			return false;
		}
	}

	// Mark hint as dismissed
	function dismissHint() {
		if (browser) {
			try {
				localStorage.setItem(STORAGE_KEY, 'true');
			} catch (error) {
				console.error('Failed to save hint dismissal state:', error);
			}
		}
		onDismiss();
	}

	// Auto-hide if already dismissed
	$effect(() => {
		if (show && isHintDismissed()) {
			onDismiss();
		}
	});
</script>

{#if show && !isHintDismissed()}
	<div class="backup-hint">
		<div class="backup-hint-arrow"></div>
		<div class="backup-hint-content">
			<div class="backup-hint-header">
				<div class="backup-hint-icon">
					<Info size={18} />
				</div>
				<h3 class="backup-hint-title">{m.backup_hint_title()}</h3>
				<button class="backup-hint-close" onclick={dismissHint} title={m.backup_hint_close()}>
					<X size={16} />
				</button>
			</div>
			<p class="backup-hint-message">{m.backup_hint_message()}</p>
			<div class="backup-hint-actions">
				<button class="backup-hint-dismiss" onclick={dismissHint}>
					{m.backup_hint_dismiss()}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.backup-hint {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		width: 280px;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		overflow: hidden;
		animation: slideIn 0.2s ease-out;
	}

	.backup-hint-arrow {
		position: absolute;
		top: -8px;
		right: 12px;
		width: 16px;
		height: 16px;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-bottom: none;
		border-right: none;
		transform: rotate(45deg);
	}

	.backup-hint-content {
		position: relative;
		padding: var(--spacing-md);
	}

	.backup-hint-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-sm);
	}

	.backup-hint-icon {
		color: var(--color-primary);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.backup-hint-title {
		flex: 1;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
		line-height: 1.3;
	}

	.backup-hint-close {
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: 2px;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.backup-hint-close:hover {
		background: var(--color-surface);
		color: var(--color-text-primary);
	}

	.backup-hint-message {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		line-height: 1.4;
		margin: 0 0 var(--spacing-md) 0;
	}

	.backup-hint-actions {
		display: flex;
		justify-content: flex-end;
	}

	.backup-hint-dismiss {
		background: var(--color-primary);
		color: #ffffff;
		border: none;
		padding: var(--spacing-xs) var(--spacing-md);
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.backup-hint-dismiss:hover {
		background: var(--color-primary-hover);
		transform: translateY(-1px);
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
		.backup-hint {
			width: 260px;
			right: -20px;
		}

		.backup-hint-arrow {
			right: 32px;
		}
	}
</style>
