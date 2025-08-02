<script lang="ts">
	import '../app.css';
	import { Target } from '@lucide/svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import ImportExportDropdown from '$lib/components/ImportExportDropdown.svelte';

	let { children } = $props();
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
