<script lang="ts">
	import '../app.css';
	import { Target, CheckSquare, Search } from '@lucide/svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import ImportExportDropdown from '$lib/components/Backup/ImportExportDropdown.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';

	let { children } = $props();
	let commandPaletteRef: CommandPalette;

	function openCommandPalette() {
		if (commandPaletteRef && commandPaletteRef.toggleCommandPalette) {
			commandPaletteRef.toggleCommandPalette();
		}
	}
</script>

<!-- Top Bar -->
<header class="top-bar">
	<div class="container">
		<div class="flex justify-between items-center">
			<!-- Logo -->
			<a href="/" class="logo">
				<Target size={28} class="logo-icon" />
				<span>{m.title()}</span>
			</a>

			<!-- Controls -->
			<div class="controls">
				<button class="btn btn-icon" title={m.search()} onclick={openCommandPalette}>
					<Search size={20} />
				</button>
				<a href="/tasks" class="btn btn-icon">
					<CheckSquare size={20} />
				</a>
				<LanguageSwitcher />
				<ImportExportDropdown />
				<ThemeSwitcher />
			</div>
		</div>
	</div>
</header>

<!-- Main Content -->
<main class="main-content">
	<div class="container">
		{@render children()}
	</div>
</main>

<!-- Used for SSG: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/sveltekit#static-site-generation-ssg -->
<div style="display:none">
	{#each locales as locale (locale)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<!-- Command Palette -->
<CommandPalette bind:this={commandPaletteRef} />
