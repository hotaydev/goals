<script lang="ts">
	import { modalStore } from '$lib/stores/modalStore';
	import MilestoneModal from './MilestoneModal.svelte';
	import TaskModal from './TaskModal.svelte';
	import GoalModal from './GoalModal.svelte';
	import GoalCreationModal from './GoalCreationModal.svelte';
	import DeleteConfirmationModal from './DeleteConfirmationModal.svelte';
	import ImportConfirmationModal from './ImportConfirmationModal.svelte';
	import EvidenceModal from './EvidenceModal.svelte';
	import type { Goal } from '$lib/models/types';

	interface Props {
		goals: Goal[];
	}

	let { goals }: Props = $props();

	// Find the current goal, milestone and task based on store state
	const currentGoal = $derived(() => {
		if (!$modalStore.goalModalOpen || !$modalStore.openGoalId) return null;
		return goals.find((g) => g.id === $modalStore.openGoalId) || null;
	});

	const currentMilestone = $derived(() => {
		if (!$modalStore.milestoneModalOpen) return null;

		// For creating new milestones, there's no milestone ID
		if ($modalStore.milestoneMode === 'create') return null;

		if (!$modalStore.openMilestoneId) return null;

		for (const goal of goals) {
			const milestone = goal.milestones.find((m) => m.id === $modalStore.openMilestoneId);
			if (milestone) return milestone;
		}
		return null;
	});

	const currentTask = $derived(() => {
		if (!$modalStore.taskModalOpen) return null;

		// For creating new tasks, there's no task ID
		if ($modalStore.taskMode === 'create') return null;

		if (!$modalStore.openTaskId) return null;

		for (const goal of goals) {
			for (const milestone of goal.milestones) {
				const task = milestone.tasks.find((t) => t.id === $modalStore.openTaskId);
				if (task) return task;
			}
		}
		return null;
	});
</script>

{#if $modalStore.goalModalOpen}
	{@const goal = currentGoal()}
	{#if goal}
		<GoalModal {goal} isOpen={true} onClose={() => modalStore.closeGoalModal()} />
	{/if}
{/if}

{#if $modalStore.milestoneModalOpen}
	{@const milestone = currentMilestone()}
	<MilestoneModal
		{milestone}
		isOpen={true}
		mode={$modalStore.milestoneMode}
		goalId={$modalStore.createMilestoneGoalId}
		onClose={() => modalStore.closeMilestoneModal()}
	/>
{/if}

{#if $modalStore.taskModalOpen}
	{@const task = currentTask()}
	<TaskModal
		{task}
		isOpen={true}
		mode={$modalStore.taskMode}
		milestoneId={$modalStore.createTaskMilestoneId}
		onClose={() => modalStore.closeTaskModal()}
	/>
{/if}

{#if $modalStore.goalCreationModalOpen}
	<GoalCreationModal isOpen={true} onClose={() => modalStore.closeGoalCreationModal()} />
{/if}

{#if $modalStore.deleteConfirmationModalOpen && $modalStore.deleteConfirmation}
	<DeleteConfirmationModal
		isOpen={true}
		title={$modalStore.deleteConfirmation.title}
		message={$modalStore.deleteConfirmation.message}
		itemName={$modalStore.deleteConfirmation.itemName}
		itemType={$modalStore.deleteConfirmation.itemType}
		onConfirm={$modalStore.deleteConfirmation.onConfirm}
		onCancel={() => modalStore.closeDeleteConfirmationModal()}
	/>
{/if}

{#if $modalStore.importConfirmationModalOpen && $modalStore.importConfirmation}
	<ImportConfirmationModal
		isOpen={true}
		title={$modalStore.importConfirmation.title}
		message={$modalStore.importConfirmation.message}
		goalsCount={$modalStore.importConfirmation.goalsCount}
		milestonesCount={$modalStore.importConfirmation.milestonesCount}
		tasksCount={$modalStore.importConfirmation.tasksCount}
		onConfirm={$modalStore.importConfirmation.onConfirm}
		onCancel={$modalStore.importConfirmation.onCancel}
	/>
{/if}

{#if $modalStore.evidenceModalOpen}
	<EvidenceModal
		isOpen={true}
		context={$modalStore.evidenceContext}
		onClose={() => modalStore.closeEvidenceModal()}
	/>
{/if}
