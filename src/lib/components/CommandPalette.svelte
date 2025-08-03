<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Search, Command } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { goals } from '$lib/stores/goalsStore';

	interface SearchResult {
		id: string;
		type: 'goal' | 'milestone' | 'task';
		title: string;
		description: string;
		goalId: string;
		milestoneId?: string;
		taskId?: string;
		icon?: string;
	}

	let isOpen = $state(false);
	let query = $state('');
	let selectedIndex = $state(0);
	let searchResults = $state<SearchResult[]>([]);

	// Get all searchable items from the store
	const allSearchableItems = $derived(() => {
		const items: SearchResult[] = [];
		const goalsData = $goals;

		goalsData.forEach((goal) => {
			// Add goal
			items.push({
				id: goal.id,
				type: 'goal',
				title: goal.title,
				description: goal.description,
				goalId: goal.id,
				icon: goal.icon
			});

			// Add milestones
			goal.milestones.forEach((milestone) => {
				items.push({
					id: milestone.id,
					type: 'milestone',
					title: milestone.title,
					description: milestone.description,
					goalId: goal.id,
					milestoneId: milestone.id,
					icon: milestone.icon
				});

				// Add tasks
				milestone.tasks.forEach((task) => {
					items.push({
						id: task.id,
						type: 'task',
						title: task.title,
						description: task.description,
						goalId: goal.id,
						milestoneId: milestone.id,
						taskId: task.id,
						icon: task.icon
					});
				});
			});
		});

		return items;
	});

	// Filter results based on query
	$effect(() => {
		const items = allSearchableItems();
		if (!query.trim()) {
			searchResults = items.slice(0, 10); // Show first 10 items when no query
		} else {
			const searchTerm = query.toLowerCase();
			searchResults = items
				.filter((item: SearchResult) => {
					const titleMatch = item.title.toLowerCase().includes(searchTerm);
					const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
					return titleMatch || descriptionMatch;
				})
				.slice(0, 20); // Limit to 20 results
		}
		selectedIndex = 0; // Reset selection when query changes
	});

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			toggleCommandPalette();
		}

		if (!isOpen) return;

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				closeCommandPalette();
				break;
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				break;
			case 'Enter':
				event.preventDefault();
				if (searchResults[selectedIndex]) {
					navigateToResult(searchResults[selectedIndex]);
				}
				break;
		}
	}

	function toggleCommandPalette() {
		isOpen = !isOpen;
		if (isOpen) {
			query = '';
			selectedIndex = 0;
			// Focus the input after a brief delay to ensure the modal is rendered
			setTimeout(() => {
				const input = document.getElementById('command-palette-input');
				if (input) {
					input.focus();
				}
			}, 10);
		}
	}

	// Expose the toggle method for external use
	$effect(() => {
		// This exposes the method to parent components
		if (typeof window !== 'undefined') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).toggleCommandPalette = toggleCommandPalette;
		}
	});

	// Expose methods for parent components
	export { toggleCommandPalette };

	function closeCommandPalette() {
		isOpen = false;
		query = '';
		selectedIndex = 0;
	}

	function navigateToResult(result: SearchResult) {
		closeCommandPalette();

		if (result.type === 'goal') {
			goto(`/goal/${result.goalId}`);
		} else if (result.type === 'milestone') {
			goto(`/goal/${result.goalId}?milestone=${result.milestoneId}`);
		} else if (result.type === 'task') {
			goto(`/goal/${result.goalId}?task=${result.taskId}`);
		}
	}

	function getIcon(type: string, icon?: string) {
		if (icon) return icon;

		switch (type) {
			case 'goal':
				return '🎯';
			case 'milestone':
				return '🏁';
			case 'task':
				return '📋';
			default:
				return '📄';
		}
	}

	function getTypeLabel(type: string) {
		switch (type) {
			case 'goal':
				return 'Goal';
			case 'milestone':
				return 'Milestone';
			case 'task':
				return 'Task';
			default:
				return 'Item';
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});
</script>

<!-- Command Palette Modal -->
{#if isOpen}
	<div
		class="command-palette-overlay"
		onclick={closeCommandPalette}
		onkeydown={(e) => e.key === 'Escape' && closeCommandPalette()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="command-palette"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && closeCommandPalette()}
			role="document"
			tabindex="-1"
		>
			<!-- Header -->
			<div class="command-palette-header">
				<div class="search-icon">
					<Search size={20} />
				</div>
				<input
					id="command-palette-input"
					type="text"
					placeholder="Search goals, milestones, and tasks..."
					bind:value={query}
					class="command-palette-input"
				/>
				<div class="shortcut-hint">
					<Command size={14} />
					<span>K</span>
				</div>
			</div>

			<!-- Results -->
			<div class="command-palette-results">
				{#if searchResults.length === 0}
					<div class="no-results">
						<p>No results found</p>
					</div>
				{:else}
					{#each searchResults as result, index (result.id)}
						<button
							class="result-item"
							class:selected={index === selectedIndex}
							onclick={() => navigateToResult(result)}
							onkeydown={(e) => e.key === 'Enter' && navigateToResult(result)}
						>
							<div class="result-icon">
								{getIcon(result.type, result.icon)}
							</div>
							<div class="result-content">
								<div class="result-title">{result.title}</div>
								<div class="result-description">{result.description}</div>
								<div class="result-type">{getTypeLabel(result.type)}</div>
							</div>
							{#if index === selectedIndex}
								<div class="result-actions">
									<span class="enter-hint">↵</span>
								</div>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.command-palette-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 1000;
		padding: var(--spacing-xl);
		backdrop-filter: blur(4px);
	}

	.command-palette {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		width: 100%;
		max-width: 600px;
		max-height: 500px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.command-palette-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-surface);
	}

	.search-icon {
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.command-palette-input {
		flex: 1;
		border: none;
		background: none;
		font-size: 1rem;
		color: var(--color-text-primary);
		outline: none;
	}

	.command-palette-input::placeholder {
		color: var(--color-text-muted);
	}

	.shortcut-hint {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		background-color: var(--color-surface-elevated);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.command-palette-results {
		flex: 1;
		overflow-y: auto;
		max-height: 400px;
	}

	.no-results {
		padding: var(--spacing-xl);
		text-align: center;
		color: var(--color-text-muted);
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md) var(--spacing-lg);
		border: none;
		background: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
		transition: background-color var(--transition-fast);
		border-bottom: 1px solid var(--color-border);
	}

	.result-item:hover,
	.result-item.selected {
		background-color: var(--color-surface-elevated);
	}

	.result-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
		width: 2rem;
		text-align: center;
	}

	.result-content {
		flex: 1;
		min-width: 0;
	}

	.result-title {
		font-weight: 500;
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-xs);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-xs);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-type {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.result-actions {
		flex-shrink: 0;
	}

	.enter-hint {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		background-color: var(--color-surface);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.command-palette-overlay {
			padding: var(--spacing-md);
		}

		.command-palette {
			max-height: 80vh;
		}

		.command-palette-results {
			max-height: 60vh;
		}
	}
</style>
