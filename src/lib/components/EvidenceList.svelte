<script lang="ts">
	import type { Evidence } from '$lib/models/types';
	import {
		ExternalLink,
		FileText,
		Plus,
		Pencil,
		Trash2,
		ChevronDown,
		ChevronRight
	} from '@lucide/svelte';

	interface Props {
		evidences: Evidence[];
		onAdd: () => void;
		onEdit: (evidence: Evidence) => void;
		onDelete: (evidenceId: string) => void;
	}

	let { evidences, onAdd, onEdit, onDelete }: Props = $props();
	let isExpanded = $state(false);

	function handleLinkClick(content: string) {
		// Ensure the URL has a protocol
		const url =
			content.startsWith('http://') || content.startsWith('https://')
				? content
				: `https://${content}`;
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	function isValidUrl(content: string): boolean {
		try {
			// Check if it's a valid URL format
			const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
			return urlRegex.test(content);
		} catch {
			return false;
		}
	}
</script>

<div class="evidences-section">
	<div class="evidences-header">
		<button
			class="expand-toggle"
			onclick={() => (isExpanded = !isExpanded)}
			title="Toggle evidences section"
		>
			{#if isExpanded}
				<ChevronDown size={16} />
			{:else}
				<ChevronRight size={16} />
			{/if}
			<h4>Evidences & Notes ({evidences.length})</h4>
		</button>
		<button class="add-evidence-btn" onclick={onAdd} title="Add evidence or note">
			<Plus size={16} />
			Add
		</button>
	</div>

	{#if isExpanded}
		{#if evidences.length === 0}
			<div class="empty-state">
				<p>No evidences or notes yet. Add some to track your progress and important links.</p>
			</div>
		{:else}
			<div class="evidences-list">
				{#each evidences as evidence (evidence.id)}
					<div class="evidence-item">
						<div class="evidence-icon">
							{#if evidence.type === 'link'}
								<ExternalLink size={16} />
							{:else}
								<FileText size={16} />
							{/if}
						</div>
						<div class="evidence-content">
							<div class="evidence-title">
								{evidence.title}
								{#if evidence.type === 'link' && isValidUrl(evidence.content)}
									<button
										class="link-button"
										onclick={() => handleLinkClick(evidence.content)}
										title="Open link in new tab"
									>
										• {evidence.content}
									</button>
								{:else}
									<span class="evidence-text">• {evidence.content}</span>
								{/if}
							</div>
						</div>
						<div class="evidence-actions">
							<button
								class="action-btn edit"
								onclick={() => onEdit(evidence)}
								title="Edit evidence"
							>
								<Pencil size={14} />
							</button>
							<button
								class="action-btn delete"
								onclick={() => onDelete(evidence.id)}
								title="Delete evidence"
							>
								<Trash2 size={14} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.evidences-section {
		border-top: 1px solid var(--color-border);
		padding-top: var(--spacing-md);
		margin-top: var(--spacing-md);
	}

	.evidences-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-md);
	}

	.expand-toggle {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--spacing-xs);
		border-radius: var(--radius-sm);
		transition: background-color 0.2s ease;
		color: var(--color-text-primary);
	}

	.expand-toggle:hover {
		background: var(--color-background-secondary);
	}

	.expand-toggle h4 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1rem;
		font-weight: 600;
	}

	.add-evidence-btn {
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-md);
		background-color: var(--color-primary);
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.add-evidence-btn:hover {
		background-color: var(--color-primary-hover);
		border-color: var(--color-primary-hover);
		color: white;
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-lg);
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.empty-state p {
		margin: 0;
	}

	.evidences-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.evidence-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		min-height: 40px;
	}

	.evidence-item:hover {
		box-shadow: var(--shadow-sm);
		border-color: var(--color-border-hover);
		transform: translateY(-1px);
		background-color: var(--color-surface);
	}

	.evidence-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: var(--color-background-tertiary);
		border-radius: var(--radius-sm);
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.evidence-content {
		flex: 1;
		min-width: 0;
	}

	.evidence-title {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.evidence-text {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		line-height: 1.3;
		font-weight: normal;
	}

	.link-button {
		background: none;
		border: none;
		color: var(--color-primary);
		text-decoration: underline;
		cursor: pointer;
		font-size: 0.75rem;
		padding: 0;
		text-align: left;
		word-break: break-all;
		font-weight: normal;
	}

	.link-button:hover {
		color: var(--color-primary-dark);
	}

	.evidence-actions {
		display: flex;
		gap: var(--spacing-xs);
		flex-shrink: 0;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.action-btn.edit {
		background: var(--color-background-tertiary);
		color: var(--color-text-secondary);
	}

	.action-btn.edit:hover {
		background: var(--color-primary);
		color: white;
	}

	.action-btn.delete {
		background: var(--color-background-tertiary);
		color: var(--color-text-secondary);
	}

	.action-btn.delete:hover {
		background: var(--color-error);
		color: white;
	}
</style>
