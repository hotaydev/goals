<script lang="ts">
	import { Download, Upload, Archive } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { goalsStore } from '$lib/stores/goalsStore';
	import { modalStore } from '$lib/stores/modalStore';
	import { validateImportData, type ImportValidationResult } from '$lib/services/validation';
	import { m } from '$lib/paraglide/messages';

	let isOpen = $state(false);
	let dropdownElement: HTMLDivElement;
	let fileInput: HTMLInputElement;

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		isOpen = false;
	}

	function handleExport() {
		try {
			const data = goalsStore.exportData();
			const jsonString = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonString], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = `goals-backup-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			alert(m.backup_export_failed_to_export());
			console.error('Export error:', error);
		}
		closeDropdown();
	}

	function handleImportClick() {
		fileInput.click();
		closeDropdown();
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
			alert(m.backup_import_invalid_file());
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const jsonData = JSON.parse(e.target?.result as string);
				const validation: ImportValidationResult = validateImportData(jsonData);

				if (!validation.isValid) {
					const errorMessage = `${m.backup_import_invalid_file_format()}\n\n${validation.errors.join('\n')}`;
					alert(errorMessage);
					return;
				}

				const importData = validation.data!;
				const hasExistingGoals = goalsStore.hasData();

				if (hasExistingGoals) {
					// Count items in the import data
					const goalsCount = importData.length;
					const milestonesCount = importData.reduce((sum, goal) => sum + goal.milestones.length, 0);
					const tasksCount = importData.reduce(
						(sum, goal) =>
							sum + goal.milestones.reduce((mSum, milestone) => mSum + milestone.tasks.length, 0),
						0
					);

					// Show confirmation modal
					modalStore.openImportConfirmationModal(
						m.backup_import_modal_title(),
						m.backup_import_modal_message(),
						goalsCount,
						milestonesCount,
						tasksCount,
						() => {
							goalsStore.importData(importData);
							modalStore.closeImportConfirmationModal();
							// Refresh page to ensure all components are updated
							window.location.reload();
						},
						() => {
							modalStore.closeImportConfirmationModal();
						}
					);
				} else {
					// No existing goals, import directly
					goalsStore.importData(importData);
					// Refresh page to ensure all components are updated
					window.location.reload();
				}
			} catch (error) {
				alert(m.backup_import_failed_to_read_file());
				console.error('Import error:', error);
			}
		};

		reader.readAsText(file);
		// Reset the input value so the same file can be selected again
		input.value = '';
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="import-export-dropdown" bind:this={dropdownElement}>
	<button
		class="btn btn-icon"
		onclick={toggleDropdown}
		title={m.backup_import_or_export_goals()}
		aria-label={m.backup_import_or_export_goals()}
	>
		<Archive size={20} />
	</button>

	{#if isOpen}
		<div class="dropdown-menu">
			<button class="dropdown-item" onclick={handleExport}>
				<Download size={16} />
				{m.export_goals()}
			</button>
			<button class="dropdown-item" onclick={handleImportClick}>
				<Upload size={16} />
				{m.import_goals()}
			</button>
		</div>
	{/if}
</div>

<!-- Hidden file input -->
<input
	bind:this={fileInput}
	type="file"
	accept=".json,application/json"
	style="display: none;"
	onchange={handleFileSelect}
/>

<style>
	.import-export-dropdown {
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

	@media (max-width: 768px) {
		.dropdown-menu {
			right: auto;
			left: 0;
		}
	}
</style>
