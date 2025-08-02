import { writable } from 'svelte/store';

export type ModalMode = 'view' | 'edit' | 'create';

export interface ModalState {
	milestoneModalOpen: boolean;
	taskModalOpen: boolean;
	goalModalOpen: boolean;
	goalCreationModalOpen: boolean;
	deleteConfirmationModalOpen: boolean;
	importConfirmationModalOpen: boolean;
	evidenceModalOpen: boolean;
	openMilestoneId?: string;
	openTaskId?: string;
	openGoalId?: string;
	milestoneMode: ModalMode;
	taskMode: ModalMode;
	createTaskMilestoneId?: string; // For creating new tasks within a milestone
	createMilestoneGoalId?: string; // For creating new milestones within a goal
	evidenceContext?: {
		type: 'task' | 'milestone';
		goalId: string;
		milestoneId?: string;
		taskId?: string;
		editingEvidenceId?: string;
	};
	deleteConfirmation?: {
		title: string;
		message: string;
		itemName: string;
		itemType: 'goal' | 'milestone' | 'task';
		onConfirm: () => void;
	};
	importConfirmation?: {
		title: string;
		message: string;
		goalsCount: number;
		milestonesCount: number;
		tasksCount: number;
		onConfirm: () => void;
		onCancel: () => void;
	};
}

function createModalStore() {
	const { subscribe, set, update } = writable<ModalState>({
		milestoneModalOpen: false,
		taskModalOpen: false,
		goalModalOpen: false,
		goalCreationModalOpen: false,
		deleteConfirmationModalOpen: false,
		importConfirmationModalOpen: false,
		evidenceModalOpen: false,
		openMilestoneId: undefined,
		openTaskId: undefined,
		openGoalId: undefined,
		milestoneMode: 'view',
		taskMode: 'view',
		createTaskMilestoneId: undefined,
		createMilestoneGoalId: undefined,
		deleteConfirmation: undefined,
		importConfirmation: undefined,
		evidenceContext: undefined
	});

	return {
		subscribe,
		openMilestoneModal: (milestoneId: string, mode: ModalMode = 'view') => {
			update((state) => ({
				...state,
				milestoneModalOpen: true,
				taskModalOpen: false, // Close any open task modal
				goalModalOpen: false, // Close any open goal modal
				openMilestoneId: milestoneId,
				openTaskId: undefined,
				openGoalId: undefined,
				milestoneMode: mode,
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: undefined
			}));
		},
		openTaskModal: (taskId: string, mode: ModalMode = 'view') => {
			update((state) => ({
				...state,
				milestoneModalOpen: false, // Close any open milestone modal
				goalModalOpen: false, // Close any open goal modal
				taskModalOpen: true,
				openMilestoneId: undefined,
				openTaskId: taskId,
				openGoalId: undefined,
				taskMode: mode,
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: undefined
			}));
		},
		openCreateTaskModal: (milestoneId: string) => {
			update((state) => ({
				...state,
				milestoneModalOpen: false,
				goalModalOpen: false,
				taskModalOpen: true,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: undefined,
				taskMode: 'create',
				createTaskMilestoneId: milestoneId,
				createMilestoneGoalId: undefined
			}));
		},
		openGoalModal: (goalId: string) => {
			update((state) => ({
				...state,
				milestoneModalOpen: false, // Close any open milestone modal
				taskModalOpen: false, // Close any open task modal
				goalModalOpen: true,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: goalId,
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: undefined
			}));
		},
		openCreateMilestoneModal: (goalId: string) => {
			update((state) => ({
				...state,
				milestoneModalOpen: true,
				taskModalOpen: false,
				goalModalOpen: false,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: undefined,
				milestoneMode: 'create',
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: goalId
			}));
		},
		setMilestoneMode: (mode: ModalMode) => {
			update((state) => ({
				...state,
				milestoneMode: mode
			}));
		},
		setTaskMode: (mode: ModalMode) => {
			update((state) => ({
				...state,
				taskMode: mode
			}));
		},
		closeMilestoneModal: () => {
			update((state) => ({
				...state,
				milestoneModalOpen: false,
				openMilestoneId: undefined,
				milestoneMode: 'view'
			}));
		},
		closeTaskModal: () => {
			update((state) => ({
				...state,
				taskModalOpen: false,
				openTaskId: undefined,
				taskMode: 'view',
				createTaskMilestoneId: undefined
			}));
		},
		closeGoalModal: () => {
			update((state) => ({
				...state,
				goalModalOpen: false,
				openGoalId: undefined,
				createMilestoneGoalId: undefined
			}));
		},
		openGoalCreationModal: () => {
			update((state) => ({
				...state,
				milestoneModalOpen: false,
				taskModalOpen: false,
				goalModalOpen: false,
				goalCreationModalOpen: true,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: undefined,
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: undefined
			}));
		},
		closeGoalCreationModal: () => {
			update((state) => ({
				...state,
				goalCreationModalOpen: false
			}));
		},
		openDeleteConfirmationModal: (
			title: string,
			message: string,
			itemName: string,
			itemType: 'goal' | 'milestone' | 'task',
			onConfirm: () => void
		) => {
			update((state) => ({
				...state,
				deleteConfirmationModalOpen: true,
				deleteConfirmation: {
					title,
					message,
					itemName,
					itemType,
					onConfirm
				}
			}));
		},
		closeDeleteConfirmationModal: () => {
			update((state) => ({
				...state,
				deleteConfirmationModalOpen: false,
				deleteConfirmation: undefined
			}));
		},
		openImportConfirmationModal: (
			title: string,
			message: string,
			goalsCount: number,
			milestonesCount: number,
			tasksCount: number,
			onConfirm: () => void,
			onCancel: () => void
		) => {
			update((state) => ({
				...state,
				importConfirmationModalOpen: true,
				importConfirmation: {
					title,
					message,
					goalsCount,
					milestonesCount,
					tasksCount,
					onConfirm,
					onCancel
				}
			}));
		},
		closeImportConfirmationModal: () => {
			update((state) => ({
				...state,
				importConfirmationModalOpen: false,
				importConfirmation: undefined
			}));
		},
		openEvidenceModal: (context: {
			type: 'task' | 'milestone';
			goalId: string;
			milestoneId?: string;
			taskId?: string;
			editingEvidenceId?: string;
		}) => {
			update((state) => ({
				...state,
				evidenceModalOpen: true,
				evidenceContext: context
			}));
		},
		closeEvidenceModal: () => {
			update((state) => ({
				...state,
				evidenceModalOpen: false,
				evidenceContext: undefined
			}));
		},
		closeAllModals: () => {
			set({
				milestoneModalOpen: false,
				taskModalOpen: false,
				goalModalOpen: false,
				goalCreationModalOpen: false,
				deleteConfirmationModalOpen: false,
				importConfirmationModalOpen: false,
				evidenceModalOpen: false,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: undefined,
				milestoneMode: 'view',
				taskMode: 'view',
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: undefined,
				deleteConfirmation: undefined,
				importConfirmation: undefined,
				evidenceContext: undefined
			});
		}
	};
}

export const modalStore = createModalStore();
