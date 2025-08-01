import { writable } from 'svelte/store';

export type ModalMode = 'view' | 'edit' | 'create';

export interface ModalState {
	milestoneModalOpen: boolean;
	taskModalOpen: boolean;
	goalModalOpen: boolean;
	openMilestoneId?: string;
	openTaskId?: string;
	openGoalId?: string;
	milestoneMode: ModalMode;
	taskMode: ModalMode;
	goalMode: ModalMode;
	createTaskMilestoneId?: string; // For creating new tasks within a milestone
	createMilestoneGoalId?: string; // For creating new milestones within a goal
}

function createModalStore() {
	const { subscribe, set, update } = writable<ModalState>({
		milestoneModalOpen: false,
		taskModalOpen: false,
		goalModalOpen: false,
		openMilestoneId: undefined,
		openTaskId: undefined,
		openGoalId: undefined,
		milestoneMode: 'view',
		taskMode: 'view',
		goalMode: 'view',
		createTaskMilestoneId: undefined,
		createMilestoneGoalId: undefined
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
		openGoalModal: (goalId: string, mode: ModalMode = 'view') => {
			update((state) => ({
				...state,
				milestoneModalOpen: false, // Close any open milestone modal
				taskModalOpen: false, // Close any open task modal
				goalModalOpen: true,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: goalId,
				goalMode: mode,
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
		setGoalMode: (mode: ModalMode) => {
			update((state) => ({
				...state,
				goalMode: mode
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
				goalMode: 'view',
				createMilestoneGoalId: undefined
			}));
		},
		closeAllModals: () => {
			set({
				milestoneModalOpen: false,
				taskModalOpen: false,
				goalModalOpen: false,
				openMilestoneId: undefined,
				openTaskId: undefined,
				openGoalId: undefined,
				milestoneMode: 'view',
				taskMode: 'view',
				goalMode: 'view',
				createTaskMilestoneId: undefined,
				createMilestoneGoalId: undefined
			});
		}
	};
}

export const modalStore = createModalStore();
