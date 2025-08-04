<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages';

	let isDark = $state(false);

	function toggleTheme() {
		isDark = !isDark;
		updateTheme();
	}

	function updateTheme() {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		}
	}

	onMount(() => {
		// Check for saved theme preference or default to light
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
		updateTheme();
	});

	let buttonTitle = $derived(isDark ? m.switch_to_light_theme() : m.switch_to_dark_theme());
</script>

<button class="btn btn-icon" onclick={toggleTheme} aria-label={buttonTitle} title={buttonTitle}>
	{#if isDark}
		<Sun size={20} />
	{:else}
		<Moon size={20} />
	{/if}
</button>
