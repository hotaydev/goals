<script lang="ts">
	import type { SMARTCriteria, TargetDate, ValueEffortLevel, TaskStatus } from '$lib/models/types';
	import EditableForm from '$lib/components/EditableForm.svelte';

	interface Props {
		title: string;
		description: string;
		icon?: string;
		smart: SMARTCriteria;
		targetDate: TargetDate;
		value: ValueEffortLevel;
		effort: ValueEffortLevel;
		onSave: (data: Omit<TaskFormData, 'status'>) => void;
		onCancel: () => void;
		isSubmitting?: boolean;
	}

	export interface TaskFormData {
		title: string;
		description: string;
		icon?: string;
		smart: SMARTCriteria;
		targetDate: TargetDate;
		value: ValueEffortLevel;
		effort: ValueEffortLevel;
		status: TaskStatus;
	}

	let {
		title,
		description,
		icon,
		smart,
		targetDate,
		value,
		effort,
		onSave,
		onCancel,
		isSubmitting = false
	}: Props = $props();

	function handleFormCancel() {
		onCancel();
	}
</script>

<div class="task-form">
	<EditableForm
		{title}
		{description}
		{icon}
		{smart}
		{targetDate}
		{value}
		{effort}
		onSave={(data) => onSave(data)}
		onCancel={handleFormCancel}
		{isSubmitting}
	/>
</div>

<style>
	.task-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		width: 100%;
	}
</style>
