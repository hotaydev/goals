<script lang="ts">
	import type { SMARTCriteria, TargetDate, ValueEffortLevel } from '$lib/models/types';
	import EmojiSelector from './EmojiSelector.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		title: string;
		description: string;
		icon?: string;
		smart: SMARTCriteria;
		targetDate: TargetDate;
		value: ValueEffortLevel;
		effort: ValueEffortLevel;
		onSave: (data: FormData) => void;
		onCancel: () => void;
		isSubmitting?: boolean;
	}

	interface FormData {
		title: string;
		description: string;
		icon?: string;
		smart: SMARTCriteria;
		targetDate: TargetDate;
		value: ValueEffortLevel;
		effort: ValueEffortLevel;
	}

	let {
		title,
		description,
		icon,
		smart,
		targetDate,
		value,
		effort,
		onSave,
		onCancel,
		isSubmitting = false
	}: Props = $props();

	let formData = $state<FormData>({
		title,
		description,
		icon,
		smart: { ...smart },
		targetDate: { ...targetDate },
		value,
		effort
	});

	const smartLabels = {
		specific: m.smart_label_specific(),
		measurable: m.smart_label_measurable(),
		achievable: m.smart_label_achievable(),
		relevant: m.smart_label_relevant(),
		timeBound: m.smart_label_time_bound()
	};

	const valueEffortOptions: ValueEffortLevel[] = ['high', 'low'];
	const formatter = new Intl.DateTimeFormat(undefined, { month: 'long' });
	const months = Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2000, i, 1)));

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (isSubmitting) return;
		onSave(formData);
	}

	function handleCancel() {
		if (isSubmitting) return;
		onCancel();
	}

	function updateSmart(key: keyof SMARTCriteria, value: string) {
		formData.smart[key] = value;
	}
</script>

<div class="editable-form">
	<form onsubmit={handleSubmit}>
		<!-- Basic Information -->
		<div class="form-section">
			<h3>{m.basic_information()}</h3>
			<div class="form-grid">
				<div class="form-group full-width">
					<label for="title">{m.title_string()} *</label>
					<input
						id="title"
						type="text"
						bind:value={formData.title}
						required
						disabled={isSubmitting}
						placeholder={m.enter_title()}
					/>
				</div>

				<div class="form-group full-width">
					<label for="description">{m.description()}</label>
					<textarea
						id="description"
						bind:value={formData.description}
						disabled={isSubmitting}
						placeholder={m.enter_description()}
						rows="3"
					></textarea>
				</div>

				<div class="form-group">
					<label for="icon">{m.goal_creation_icon()}</label>
					<EmojiSelector
						value={formData.icon}
						onChange={(emoji) => (formData.icon = emoji)}
						disabled={isSubmitting}
					/>
				</div>
			</div>
		</div>

		<!-- Value & Effort Matrix -->
		<div class="form-section">
			<h3>{m.value_effort_matrix()}</h3>
			<div class="form-grid">
				<div class="form-group">
					<label for="value">{m.value()} *</label>
					<select id="value" bind:value={formData.value} required disabled={isSubmitting}>
						{#each valueEffortOptions as option (option)}
							<option value={option}>{option === 'high' ? m.high() : m.low()}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="effort">{m.effort()} *</label>
					<select id="effort" bind:value={formData.effort} required disabled={isSubmitting}>
						{#each valueEffortOptions as option (option)}
							<option value={option}>{option === 'high' ? m.high() : m.low()}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Target Date -->
		<div class="form-section">
			<h3>{m.target_date()}</h3>
			<div class="form-grid">
				<div class="form-group">
					<label for="year">{m.year()} *</label>
					<input
						id="year"
						type="number"
						bind:value={formData.targetDate.year}
						required
						disabled={isSubmitting}
						min={new Date().getFullYear()}
						max="2100"
					/>
				</div>

				<div class="form-group">
					<label for="month">{m.month()}</label>
					<select id="month" bind:value={formData.targetDate.month} disabled={isSubmitting}>
						<option value={undefined}>{m.not_specified()}</option>
						{#each months as month, index (month)}
							<option value={index + 1}>{month.charAt(0).toUpperCase() + month.slice(1)}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="day">{m.day()}</label>
					<input
						id="day"
						type="number"
						bind:value={formData.targetDate.day}
						disabled={isSubmitting}
						min="1"
						max="31"
						placeholder={m.optional()}
					/>
				</div>
			</div>
		</div>

		<!-- SMART Criteria -->
		<div class="form-section">
			<h3>{m.smart_goals_criteria()}</h3>
			<div class="smart-form-grid">
				{#each Object.entries(smartLabels) as [key, label] (key)}
					<div class="form-group">
						<label for={key}>
							<span class="smart-letter">{key.charAt(0).toUpperCase()}</span>
							{label}
						</label>
						<textarea
							id={key}
							value={formData.smart[key as keyof SMARTCriteria]}
							oninput={(e) => updateSmart(key as keyof SMARTCriteria, e.currentTarget.value)}
							disabled={isSubmitting}
							placeholder={m.smart_goals_enter_criteria({ label: label.toLowerCase() })}
							rows="3"
						></textarea>
					</div>
				{/each}
			</div>
		</div>

		<!-- Form Actions -->
		<div class="form-actions">
			<button type="button" class="button-secondary" onclick={handleCancel} disabled={isSubmitting}>
				{m.cancel()}
			</button>
			<button type="submit" class="button-primary" disabled={isSubmitting}>
				{isSubmitting ? m.saving() : m.save_changes()}
			</button>
		</div>
	</form>
</div>

<style>
	.editable-form {
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}

	.form-section {
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-md);
	}

	.form-section h3 {
		margin: 0 0 var(--spacing-md) 0;
		color: var(--color-text-primary);
		font-size: 1.125rem;
		font-weight: 600;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-md);
	}

	.smart-form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-md);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-weight: 500;
		color: var(--color-text-primary);
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.smart-letter {
		width: 1.5rem;
		height: 1.5rem;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	input,
	select,
	textarea {
		padding: var(--spacing-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-family: inherit;
		background-color: var(--color-background);
		color: var(--color-text-primary);
		transition: border-color 0.2s ease;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	input:disabled,
	select:disabled,
	textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
		font-family: inherit;
		line-height: 1.5;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-md);
		padding-top: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
		margin-top: var(--spacing-xl);
	}

	.button-primary,
	.button-secondary {
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.button-primary {
		background-color: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.button-primary:hover:not(:disabled) {
		background-color: var(--color-primary-hover);
		border-color: var(--color-primary-hover);
	}

	.button-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-secondary {
		background-color: var(--color-background);
		color: var(--color-text-secondary);
		border-color: var(--color-border);
	}

	.button-secondary:hover:not(:disabled) {
		background-color: var(--color-surface);
		border-color: var(--color-text-muted);
	}

	.button-secondary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.form-grid {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column-reverse;
		}

		.button-primary,
		.button-secondary {
			width: 100%;
		}
	}
</style>
