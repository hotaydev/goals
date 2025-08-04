<script lang="ts">
	import { slide } from 'svelte/transition';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		value?: string;
		onChange: (emoji: string) => void;
		disabled?: boolean;
	}

	let { value = '', onChange, disabled = false }: Props = $props();

	const goalIcons = [
		'🏃‍♂️',
		'📚',
		'💰',
		'🥗',
		'🧘‍♀️',
		'🎯',
		'✍️',
		'🌱',
		'🧠',
		'🧹',
		'💤',
		'🏡',
		'📈',
		'🛒',
		'🚀'
	];

	let isOpen = $state(false);
	let customEmoji = $state(value);

	function handleEmojiSelect(emoji: string) {
		onChange(emoji);
		customEmoji = emoji;
		isOpen = false;
	}

	function handleCustomEmojiChange(event: Event) {
		const target = event.target as HTMLInputElement;
		customEmoji = target.value;
		onChange(target.value);
	}

	function toggleDropdown() {
		if (!disabled) {
			isOpen = !isOpen;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.emoji-selector')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="emoji-selector">
	<div class="emoji-input-container">
		<input
			type="text"
			bind:value={customEmoji}
			oninput={handleCustomEmojiChange}
			{disabled}
			placeholder="🎯"
			maxlength="2"
			class="emoji-input"
		/>
		<button
			type="button"
			class="emoji-dropdown-button"
			onclick={toggleDropdown}
			{disabled}
			aria-label={m.select_emoji()}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<polyline points="6,9 12,15 18,9"></polyline>
			</svg>
		</button>
	</div>

	{#if isOpen}
		<div class="emoji-dropdown" transition:slide={{ duration: 200 }}>
			<div class="emoji-grid">
				{#each goalIcons as emoji (emoji)}
					<button
						type="button"
						class="emoji-option"
						onclick={() => handleEmojiSelect(emoji)}
						aria-label={`Select ${emoji} emoji`}
					>
						{emoji}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.emoji-selector {
		position: relative;
		width: 100%;
	}

	.emoji-input-container {
		display: flex;
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-background);
		transition: border-color 0.2s ease;
	}

	.emoji-input-container:focus-within {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.emoji-input {
		flex: 1;
		padding: var(--spacing-sm);
		border: none;
		background: transparent;
		font-size: 1.25rem;
		color: var(--color-text-primary);
		font-family: inherit;
		width: 100%;
		box-sizing: border-box;
	}

	.emoji-input:focus {
		outline: none;
	}

	.emoji-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.emoji-dropdown-button {
		padding: var(--spacing-sm);
		border: none;
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease;
		border-left: 1px solid var(--color-border);
	}

	.emoji-dropdown-button:hover:not(:disabled) {
		color: var(--color-text-primary);
	}

	.emoji-dropdown-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.emoji-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		margin-top: 4px;
		max-height: 300px;
		overflow-y: auto;
	}

	.emoji-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 2px;
		padding: var(--spacing-sm);
	}

	.emoji-option {
		padding: var(--spacing-sm);
		border: none;
		background: transparent;
		font-size: 1.5rem;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background-color 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
	}

	.emoji-option:hover {
		background-color: var(--color-surface);
	}

	.emoji-option:active {
		background-color: var(--color-border);
	}

	@media (max-width: 768px) {
		.emoji-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
