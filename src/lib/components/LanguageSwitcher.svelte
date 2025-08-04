<script lang="ts">
	import { Globe } from '@lucide/svelte';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	import { languages, type LanguageCode } from '$lib/config/languages';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';

	let isOpen = $state(false);
	let currentLocale = $state(getLocale());

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectLanguage(locale: LanguageCode) {
		setLocale(locale);
		currentLocale = locale;
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	}

	// Close dropdown when clicking outside
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="language-switcher">
	<button
		class="btn btn-icon"
		title={m.language()}
		onclick={toggleDropdown}
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		<Globe size={20} />
	</button>

	{#if isOpen}
		<div class="dropdown-menu">
			{#each languages as language (language.code)}
				<button
					class="dropdown-item {language.code === currentLocale ? 'active' : ''}"
					onclick={() => selectLanguage(language.code)}
					role="menuitem"
				>
					{language.name}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		position: relative;
		display: inline-block;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		min-width: 160px;
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		overflow: hidden;
		margin-top: 4px;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
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

	.dropdown-item.active {
		font-weight: 700;
	}

	@media (max-width: 768px) {
		.dropdown-menu {
			right: auto;
			left: 0;
		}
	}
</style>
