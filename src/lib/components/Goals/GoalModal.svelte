<script lang="ts">
	import type { Goal } from '$lib/models/types';
	import { goalsStore } from '$lib/stores/goalsStore';
	import Modal from '$lib/components/Modal.svelte';
	import GoalForm, { type GoalFormData } from './GoalForm.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		goal: Goal;
		isOpen: boolean;
		onClose: () => void;
	}

	let { goal, isOpen, onClose }: Props = $props();

	let isSubmitting = $state(false);

	async function handleSave(formData: GoalFormData) {
		try {
			isSubmitting = true;

			const updatedGoal: Goal = {
				...goal,
				title: formData.title,
				description: formData.description,
				icon: formData.icon,
				smart: formData.smart,
				targetDate: formData.targetDate,
				updatedAt: new Date().toISOString()
			};

			goalsStore.updateGoal(updatedGoal);
			onClose();
		} catch (error) {
			console.error('Failed to save goal:', error);
			alert(m.failed_to_save_goal());
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		onClose();
	}
</script>

<Modal {isOpen} {onClose} title={m.edit_goal()}>
	<div class="goal-modal-content">
		<!-- Edit Mode Only -->
		<GoalForm
			title={goal.title}
			description={goal.description}
			icon={goal.icon}
			smart={goal.smart}
			targetDate={goal.targetDate}
			onSave={handleSave}
			onCancel={handleCancel}
			{isSubmitting}
		/>
	</div>
</Modal>

<style>
	.goal-modal-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		min-width: 700px;
		max-width: 1000px;
		width: 100%;
		padding: var(--spacing-lg);
	}

	@media (max-width: 768px) {
		.goal-modal-content {
			min-width: auto;
			max-width: 100%;
			padding: var(--spacing-md);
		}
	}
</style>
