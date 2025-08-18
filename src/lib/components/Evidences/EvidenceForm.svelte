<script lang="ts">
	import type { Evidence } from '$lib/models/types';
	import { ExternalLink, FileText, Save, X } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';
	import { isValidUrlString } from '$lib/services/validation';

	interface Props {
		evidence?: Evidence | null; // null for create, Evidence for edit
		onSave: (evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>) => void;
		onCancel: () => void;
		isSubmitting?: boolean;
	}

	let { evidence = null, onSave, onCancel, isSubmitting = false }: Props = $props();

	// Form state
	let title = $state(evidence?.title || '');
	let content = $state(evidence?.content || '');
	let type = $state<'link' | 'note'>(evidence?.type || 'note');

	// Validation state
	let errors = $state<Record<string, string>>({});

	function validateForm(): boolean {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = m.validation_required_title();
		}

		if (!content.trim()) {
			newErrors.content = m.validation_required_content();
		}

		if (type === 'link' && content.trim()) {
			// URL validation using shared validation function
			if (!isValidUrlString(content.trim())) {
				newErrors.content = m.validation_invalid_url();
			}
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit() {
		if (!validateForm() || isSubmitting) return;

		onSave({
			title: title.trim(),
			content: content.trim(),
			type
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			handleSubmit();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			onCancel();
		}
	}

	// Auto-detect if content looks like a URL
	function handleContentChange() {
		const trimmedContent = content.trim();
		if (trimmedContent && type === 'note') {
			if (isValidUrlString(trimmedContent)) {
				type = 'link';
			}
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="evidence-form" role="form" onkeydown={handleKeydown}>
	<div class="form-header">
		<h4>{evidence ? m.edit_evidence() : m.add_evidence()}</h4>
		<div class="type-selector">
			<button
				class="type-btn"
				class:active={type === 'note'}
				onclick={() => (type = 'note')}
				type="button"
			>
				<FileText size={16} />
				{m.note()}
			</button>
			<button
				class="type-btn"
				class:active={type === 'link'}
				onclick={() => (type = 'link')}
				type="button"
			>
				<ExternalLink size={16} />
				{m.link()}
			</button>
		</div>
	</div>

	<form class="form-fields" onsubmit={handleSubmit}>
		<div class="field-group">
			<label for="evidence-title">{m.title_string()}</label>
			<input
				id="evidence-title"
				type="text"
				bind:value={title}
				placeholder={type === 'link' ? m.link_description() : m.note_title()}
				class:error={errors.title}
				disabled={isSubmitting}
			/>
			{#if errors.title}
				<span class="error-message">{errors.title}</span>
			{/if}
		</div>

		<div class="field-group">
			<label for="evidence-content">
				{type === 'link' ? 'URL' : m.content()}
			</label>
			{#if type === 'link'}
				<input
					id="evidence-content"
					type="text"
					bind:value={content}
					oninput={handleContentChange}
					placeholder={`https://example.com ${m.or()} example.com`}
					class:error={errors.content}
					disabled={isSubmitting}
				/>
			{:else}
				<textarea
					id="evidence-content"
					bind:value={content}
					oninput={handleContentChange}
					placeholder={m.enter_your_note_content()}
					rows="4"
					class:error={errors.content}
					disabled={isSubmitting}
				></textarea>
			{/if}
			{#if errors.content}
				<span class="error-message">{errors.content}</span>
			{/if}
		</div>

		<div class="form-actions">
			<button type="button" class="btn secondary" onclick={onCancel} disabled={isSubmitting}>
				<X size={16} />
				{m.cancel()}
			</button>
			<button type="submit" class="btn primary" disabled={isSubmitting}>
				<Save size={16} />
				{isSubmitting ? m.saving() : m.save()}
			</button>
		</div>
	</form>
</div>

<style>
	.evidence-form {
		background: var(--color-background);
		padding: var(--spacing-lg);
		width: 100%;
	}

	.form-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-lg);
	}

	.form-header h4 {
		margin: 0;
		color: var(--color-text-primary);
		font-size: 1.125rem;
		font-weight: 600;
	}

	.type-selector {
		display: flex;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0;
		overflow: hidden;
	}

	.type-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		background: none;
		border: none;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 80px;
		border-radius: 0;
	}

	.type-btn.active {
		background: var(--color-primary);
		color: white;
		box-shadow: none;
	}

	.type-btn:hover:not(.active) {
		background: var(--color-background-tertiary);
		color: var(--color-text-primary);
	}

	.form-fields {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.field-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.field-group input,
	.field-group textarea {
		padding: var(--spacing-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-family: inherit;
		color: var(--color-text-primary);
		background: var(--color-background);
		transition: border-color 0.2s ease;
	}

	.field-group input:focus,
	.field-group textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.field-group input.error,
	.field-group textarea.error {
		border-color: var(--color-error);
	}

	.field-group input:disabled,
	.field-group textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.field-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.error-message {
		color: var(--color-error);
		font-size: 0.75rem;
		margin-top: var(--spacing-xs);
	}

	.form-actions {
		display: flex;
		gap: var(--spacing-sm);
		justify-content: flex-end;
		margin-top: var(--spacing-lg);
	}

	.btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border: none;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn.primary {
		background: var(--color-primary);
		color: white;
	}

	.btn.primary:hover:not(:disabled) {
		background: var(--color-primary-dark);
	}

	.btn.secondary {
		background: var(--color-background-secondary);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.btn.secondary:hover:not(:disabled) {
		background: var(--color-background-tertiary);
		color: var(--color-text-primary);
	}
</style>
