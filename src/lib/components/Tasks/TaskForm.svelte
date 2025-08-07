<script lang="ts">
	import type { TargetDate, ValueEffortLevel, TaskStatus } from '$lib/models/types';
	import TaskEditableForm from '$lib/components/TaskEditableForm.svelte';

	interface Props {
		title: string;
		description: string;
		icon?: string;
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
		targetDate: TargetDate;
		value: ValueEffortLevel;
		effort: ValueEffortLevel;
		status: TaskStatus;
	}

	let {
		title,
		description,
		icon,
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
	<TaskEditableForm
		{title}
		{description}
		{icon}
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
