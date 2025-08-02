<script lang="ts">
	import type { Evidence, Goal, Milestone, Task } from '$lib/models/types';
	import type { StorageData } from '$lib/stores/goalsStore';
	import { goalsStore } from '$lib/stores/goalsStore';
	import { modalStore } from '$lib/stores/modalStore';
	import Modal from './Modal.svelte';
	import EvidenceForm from './EvidenceForm.svelte';

	interface Props {
		isOpen: boolean;
		context:
			| {
					type: 'task' | 'milestone';
					goalId: string;
					milestoneId?: string;
					taskId?: string;
					editingEvidenceId?: string;
			  }
			| undefined;
		onClose: () => void;
	}

	let { isOpen, context, onClose }: Props = $props();

	let isSubmitting = $state(false);

	// Get the evidence being edited (if any)
	function getEditingEvidence(): Evidence | null {
		if (!context?.editingEvidenceId) return null;

		// Find the evidence in the appropriate entity
		if (context.type === 'task' && context.taskId && context.milestoneId) {
			const taskLocation = goalsStore.findTaskLocation(context.taskId);
			if (taskLocation) {
				let currentData: StorageData | undefined;
				const unsubscribe = goalsStore.subscribe((data) => {
					currentData = data;
				});
				unsubscribe();

				if (currentData) {
					const goal = currentData.goals.find((g: Goal) => g.id === taskLocation.goalId);
					const milestone = goal?.milestones.find(
						(m: Milestone) => m.id === taskLocation.milestoneId
					);
					const task = milestone?.tasks.find((t: Task) => t.id === context.taskId);
					return task?.evidences?.find((e: Evidence) => e.id === context.editingEvidenceId) || null;
				}
			}
		} else if (context.type === 'milestone' && context.milestoneId) {
			let currentData: StorageData | undefined;
			const unsubscribe = goalsStore.subscribe((data) => {
				currentData = data;
			});
			unsubscribe();

			if (currentData) {
				const goal = currentData.goals.find((g: Goal) => g.id === context.goalId);
				const milestone = goal?.milestones.find((m: Milestone) => m.id === context.milestoneId);
				return (
					milestone?.evidences?.find((e: Evidence) => e.id === context.editingEvidenceId) || null
				);
			}
		}

		return null;
	}

	function handleSave(evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>) {
		if (!context) return;

		try {
			isSubmitting = true;

			if (context.type === 'task' && context.taskId && context.milestoneId) {
				if (context.editingEvidenceId) {
					goalsStore.updateTaskEvidence(
						context.goalId,
						context.milestoneId,
						context.taskId,
						context.editingEvidenceId,
						evidenceData
					);
				} else {
					goalsStore.addTaskEvidence(
						context.goalId,
						context.milestoneId,
						context.taskId,
						evidenceData
					);
				}
			} else if (context.type === 'milestone' && context.milestoneId) {
				if (context.editingEvidenceId) {
					goalsStore.updateMilestoneEvidence(
						context.goalId,
						context.milestoneId,
						context.editingEvidenceId,
						evidenceData
					);
				} else {
					goalsStore.addMilestoneEvidence(context.goalId, context.milestoneId, evidenceData);
				}
			}

			modalStore.closeEvidenceModal();
		} catch (error) {
			console.error('Failed to save evidence:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		modalStore.closeEvidenceModal();
	}
</script>

<Modal {isOpen} {onClose} title={context?.editingEvidenceId ? 'Edit Evidence' : 'Add Evidence'}>
	{#if context}
		<div class="evidence-modal-content">
			<EvidenceForm
				evidence={getEditingEvidence()}
				onSave={handleSave}
				onCancel={handleCancel}
				{isSubmitting}
			/>
		</div>
	{:else}
		<div class="error-state">
			<p>Evidence context not found</p>
		</div>
	{/if}
</Modal>

<style>
	.evidence-modal-content {
		min-width: 600px;
		max-width: 800px;
		width: 100%;
	}

	.error-state {
		text-align: center;
		padding: var(--spacing-lg);
		color: var(--color-text-secondary);
	}
</style>
