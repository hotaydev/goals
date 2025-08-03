<script lang="ts">
	import '../app.css';
	import { Target, CheckSquare, Search } from '@lucide/svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import ImportExportDropdown from '$lib/components/ImportExportDropdown.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';

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
				<span>Goals</span>
			</a>

			<!-- Controls -->
			<div class="controls">
				<button class="btn btn-icon" title="Search (⌘K)" onclick={openCommandPalette}>
					<Search size={20} />
				</button>
				<a href="/tasks" class="btn btn-icon">
					<CheckSquare size={20} />
				</a>
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

<!-- Command Palette -->
<CommandPalette bind:this={commandPaletteRef} />
