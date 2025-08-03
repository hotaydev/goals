<script lang="ts">
	import { goalsStore } from '$lib/stores/goalsStore';
	import Modal from '$lib/components/Modal.svelte';
	import GoalForm, { type GoalFormData } from './GoalForm.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let isSubmitting = $state(false);

	// Default values for new goals
	const defaultGoal = {
		title: '',
		description: '',
		icon: '🎯',
		smart: {
			specific: '',
			measurable: '',
			achievable: '',
			relevant: '',
			timeBound: ''
		},
		targetDate: {
			year: new Date().getFullYear() + 1
		}
	};

	async function handleSave(formData: GoalFormData) {
		try {
			isSubmitting = true;

			goalsStore.addGoal({
				...formData,
				milestones: []
			});
			onClose();
		} catch (error) {
			console.error('Failed to create goal:', error);
			alert('Failed to create goal. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		onClose();
	}
</script>

<Modal {isOpen} {onClose} title="Create New Goal">
	<div class="goal-creation-modal-content">
		<GoalForm
			title={defaultGoal.title}
			description={defaultGoal.description}
			icon={defaultGoal.icon}
			smart={defaultGoal.smart}
			targetDate={defaultGoal.targetDate}
			onSave={handleSave}
			onCancel={handleCancel}
			{isSubmitting}
			isCreating={true}
		/>
	</div>
</Modal>

<style>
	.goal-creation-modal-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		min-width: 700px;
		max-width: 1000px;
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
		padding: var(--spacing-lg);
	}
</style>
