import { writable, derived } from 'svelte/store';
import type { Goal, Milestone, Task, Evidence } from '../models/types';
import { browser } from '$app/environment';

const STORAGE_KEY = 'goals-app-data';
const BACKUP_TRACKING_KEY = 'backup-tracking';

interface BackupTracking {
	lastBackup: string | null;
	hasUnsavedChanges: boolean;
	firstChangeAfterBackup: string | null;
	safetyReminderDismissedUntil: string | null;
}

// Helper function to load data from localStorage
function loadFromStorage(): Goal[] {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) {
			return [];
		}

		const parsed = JSON.parse(data);
		return parsed as Goal[];
	} catch (error) {
		console.error('Failed to load data from localStorage:', error);
		return [];
	}
}

// Helper function to save data to localStorage
function saveToStorage(data: Goal[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		// Note: Don't manually dispatch storage events - localStorage does this automatically for other tabs
	} catch (error) {
		console.error('Failed to save data to localStorage:', error);
	}
}

// Helper functions for backup tracking
function loadBackupTracking(): BackupTracking {
	if (!browser) {
		return {
			lastBackup: null,
			hasUnsavedChanges: false,
			firstChangeAfterBackup: null,
			safetyReminderDismissedUntil: null
		};
	}

	try {
		const data = localStorage.getItem(BACKUP_TRACKING_KEY);
		if (!data) {
			return {
				lastBackup: null,
				hasUnsavedChanges: false,
				firstChangeAfterBackup: null,
				safetyReminderDismissedUntil: null
			};
		}
		return JSON.parse(data);
	} catch (error) {
		console.error('Failed to load backup tracking:', error);
		return {
			lastBackup: null,
			hasUnsavedChanges: false,
			firstChangeAfterBackup: null,
			safetyReminderDismissedUntil: null
		};
	}
}

function saveBackupTracking(tracking: BackupTracking): void {
	if (!browser) return;

	try {
		localStorage.setItem(BACKUP_TRACKING_KEY, JSON.stringify(tracking));
	} catch (error) {
		console.error('Failed to save backup tracking:', error);
	}
}

// Create the main store
function createGoalsStore() {
	const initialData = loadFromStorage();
	const { subscribe, set, update } = writable<Goal[]>(initialData);

	// Create backup tracking store
	const backupTracking = writable<BackupTracking>(loadBackupTracking());

	// Helper function to mark changes
	function markAsChanged() {
		backupTracking.update((tracking) => {
			const now = new Date().toISOString();
			const newTracking = {
				...tracking,
				hasUnsavedChanges: true,
				firstChangeAfterBackup: tracking.firstChangeAfterBackup || now
			};
			saveBackupTracking(newTracking);
			return newTracking;
		});
	}

	// Helper function to update store and save to localStorage
	function updateAndSave(updater: (data: Goal[]) => Goal[]) {
		update((data) => {
			const newData = updater(data);
			if (browser) {
				saveToStorage(newData);
				markAsChanged();
			}
			return newData;
		});
	}

	return {
		subscribe,

		// Initialize store (called once at app startup)
		init() {
			const data = loadFromStorage();
			set(data);
		},

		// Goal operations
		updateGoal(updatedGoal: Goal) {
			updateAndSave((data) => {
				const index = data.findIndex((g) => g.id === updatedGoal.id);
				if (index >= 0) {
					// Create new objects to ensure reactivity
					const newGoals = data;
					newGoals[index] = {
						...updatedGoal,
						updatedAt: new Date().toISOString()
					};

					return data;
				}
				return data;
			});
		},

		addGoal(newGoal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
			updateAndSave((data) => {
				const goal: Goal = {
					...newGoal,
					id: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				};

				// Create new objects to ensure reactivity
				return [...data, goal];
			});
		},

		deleteGoal(goalId: string) {
			updateAndSave((data) => data.filter((g) => g.id !== goalId));
		},

		// Milestone operations
		updateMilestone(goalId: string, updatedMilestone: Milestone) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === updatedMilestone.id);
					if (milestoneIndex >= 0) {
						// Create new objects to ensure reactivity
						const newMilestones = [...goal.milestones];
						newMilestones[milestoneIndex] = {
							...updatedMilestone,
							updatedAt: new Date().toISOString()
						};

						const newGoals = data;
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return newGoals;
					}
				}
				return data;
			});
		},

		addMilestone(
			goalId: string,
			newMilestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data[goalIndex];
					const milestone: Milestone = {
						...newMilestone,
						id: crypto.randomUUID(),
						evidences: [],
						tasks: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					};

					// Create new objects to ensure reactivity
					const newMilestones = [...goal.milestones, milestone];

					const newGoals = data;
					newGoals[goalIndex] = {
						...goal,
						milestones: newMilestones,
						updatedAt: new Date().toISOString()
					};

					return newGoals;
				}
				return data;
			});
		},

		deleteMilestone(goalId: string, milestoneId: string) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data[goalIndex];

					// Create new objects to ensure reactivity
					const newMilestones = goal.milestones.filter((m) => m.id !== milestoneId);

					const newGoals = data;
					newGoals[goalIndex] = {
						...goal,
						milestones: newMilestones,
						updatedAt: new Date().toISOString()
					};

					return newGoals;
				}
				return data;
			});
		},

		// Task operations
		updateTask(goalId: string, milestoneId: string, updatedTask: Task) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex >= 0) {
						const milestone = goal.milestones[milestoneIndex];
						const taskIndex = milestone.tasks.findIndex((t) => t.id === updatedTask.id);
						if (taskIndex >= 0) {
							// Create new objects to ensure reactivity
							const newTasks = [...milestone.tasks];
							newTasks[taskIndex] = {
								...updatedTask,
								updatedAt: new Date().toISOString()
							};

							const newMilestones = [...goal.milestones];
							newMilestones[milestoneIndex] = {
								...milestone,
								tasks: newTasks,
								updatedAt: new Date().toISOString()
							};

							const newGoals = data;
							newGoals[goalIndex] = {
								...goal,
								milestones: newMilestones,
								updatedAt: new Date().toISOString()
							};

							return newGoals;
						}
					}
				}
				return data;
			});
		},

		addTask(
			goalId: string,
			milestoneId: string,
			newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex >= 0) {
						const milestone = goal.milestones[milestoneIndex];
						const task: Task = {
							...newTask,
							id: crypto.randomUUID(),
							evidences: [],
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						};

						// Create new objects to ensure reactivity
						const newTasks = [...milestone.tasks, task];

						const newMilestones = [...goal.milestones];
						newMilestones[milestoneIndex] = {
							...milestone,
							tasks: newTasks,
							updatedAt: new Date().toISOString()
						};

						const newGoals = data;
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return newGoals;
					}
				}
				return data;
			});
		},

		deleteTask(goalId: string, milestoneId: string, taskId: string) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex >= 0) {
						const milestone = goal.milestones[milestoneIndex];

						// Create new objects to ensure reactivity
						const newTasks = milestone.tasks.filter((t) => t.id !== taskId);

						const newMilestones = [...goal.milestones];
						newMilestones[milestoneIndex] = {
							...milestone,
							tasks: newTasks,
							updatedAt: new Date().toISOString()
						};

						const newGoals = data;
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return newGoals;
					}
				}
				return data;
			});
		},

		// Utility functions for finding data
		findTaskLocation(taskId: string): { goalId: string; milestoneId: string } | null {
			let currentData: Goal[];
			const unsubscribe = subscribe((data) => {
				currentData = data;
			});
			unsubscribe();

			for (const goal of currentData!) {
				for (const milestone of goal.milestones) {
					if (milestone.tasks.some((task) => task.id === taskId)) {
						return { goalId: goal.id, milestoneId: milestone.id };
					}
				}
			}
			return null;
		},

		findMilestoneLocation(milestoneId: string): string | null {
			let currentData: Goal[];
			const unsubscribe = subscribe((data) => {
				currentData = data;
			});
			unsubscribe();

			for (const goal of currentData!) {
				if (goal.milestones.some((milestone) => milestone.id === milestoneId)) {
					return goal.id;
				}
			}
			return null;
		},

		// Import/Export operations
		exportData(): Goal[] {
			let currentData: Goal[];
			const unsubscribe = subscribe((data) => {
				currentData = data;
			});
			unsubscribe();
			// Mark as backed up when exporting
			this.markAsBackedUp();
			return currentData!;
		},

		importData(data: Goal[]) {
			updateAndSave(() => data);
		},

		hasData(): boolean {
			let currentData: Goal[];
			const unsubscribe = subscribe((data) => {
				currentData = data;
			});
			unsubscribe();
			return currentData!.length > 0;
		},

		// Evidence CRUD operations for Tasks
		addTaskEvidence(
			goalId: string,
			milestoneId: string,
			taskId: string,
			evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex !== -1) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex !== -1) {
						const milestone = goal.milestones[milestoneIndex];
						const taskIndex = milestone.tasks.findIndex((t) => t.id === taskId);
						if (taskIndex !== -1) {
							const task = milestone.tasks[taskIndex];
							const newEvidence: Evidence = {
								id: crypto.randomUUID(),
								...evidenceData,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString()
							};

							const newTasks = [...milestone.tasks];
							newTasks[taskIndex] = {
								...task,
								evidences: [...task.evidences, newEvidence],
								updatedAt: new Date().toISOString()
							};

							const newMilestones = [...goal.milestones];
							newMilestones[milestoneIndex] = {
								...milestone,
								tasks: newTasks,
								updatedAt: new Date().toISOString()
							};

							const newGoals = data;
							newGoals[goalIndex] = {
								...goal,
								milestones: newMilestones,
								updatedAt: new Date().toISOString()
							};

							return newGoals;
						}
					}
				}
				return data;
			});
		},

		updateTaskEvidence(
			goalId: string,
			milestoneId: string,
			taskId: string,
			evidenceId: string,
			evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex !== -1) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex !== -1) {
						const milestone = goal.milestones[milestoneIndex];
						const taskIndex = milestone.tasks.findIndex((t) => t.id === taskId);
						if (taskIndex !== -1) {
							const task = milestone.tasks[taskIndex];
							const evidenceIndex = task.evidences.findIndex((e) => e.id === evidenceId);
							if (evidenceIndex !== -1) {
								const existingEvidence = task.evidences[evidenceIndex];
								const updatedEvidence: Evidence = {
									...existingEvidence,
									...evidenceData,
									updatedAt: new Date().toISOString()
								};

								const newEvidences = [...task.evidences];
								newEvidences[evidenceIndex] = updatedEvidence;

								const newTasks = [...milestone.tasks];
								newTasks[taskIndex] = {
									...task,
									evidences: newEvidences,
									updatedAt: new Date().toISOString()
								};

								const newMilestones = [...goal.milestones];
								newMilestones[milestoneIndex] = {
									...milestone,
									tasks: newTasks,
									updatedAt: new Date().toISOString()
								};

								const newGoals = data;
								newGoals[goalIndex] = {
									...goal,
									milestones: newMilestones,
									updatedAt: new Date().toISOString()
								};

								return newGoals;
							}
						}
					}
				}
				return data;
			});
		},

		deleteTaskEvidence(goalId: string, milestoneId: string, taskId: string, evidenceId: string) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex !== -1) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex !== -1) {
						const milestone = goal.milestones[milestoneIndex];
						const taskIndex = milestone.tasks.findIndex((t) => t.id === taskId);
						if (taskIndex !== -1) {
							const task = milestone.tasks[taskIndex];
							const newEvidences = task.evidences.filter((e) => e.id !== evidenceId);

							const newTasks = [...milestone.tasks];
							newTasks[taskIndex] = {
								...task,
								evidences: newEvidences,
								updatedAt: new Date().toISOString()
							};

							const newMilestones = [...goal.milestones];
							newMilestones[milestoneIndex] = {
								...milestone,
								tasks: newTasks,
								updatedAt: new Date().toISOString()
							};

							const newGoals = data;
							newGoals[goalIndex] = {
								...goal,
								milestones: newMilestones,
								updatedAt: new Date().toISOString()
							};

							return newGoals;
						}
					}
				}
				return data;
			});
		},

		// Evidence CRUD operations for Milestones
		addMilestoneEvidence(
			goalId: string,
			milestoneId: string,
			evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex !== -1) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex !== -1) {
						const milestone = goal.milestones[milestoneIndex];
						const newEvidence: Evidence = {
							id: crypto.randomUUID(),
							...evidenceData,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString()
						};

						const newMilestones = [...goal.milestones];
						newMilestones[milestoneIndex] = {
							...milestone,
							evidences: [...milestone.evidences, newEvidence],
							updatedAt: new Date().toISOString()
						};

						const newGoals = data;
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return newGoals;
					}
				}
				return data;
			});
		},

		updateMilestoneEvidence(
			goalId: string,
			milestoneId: string,
			evidenceId: string,
			evidenceData: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex !== -1) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex !== -1) {
						const milestone = goal.milestones[milestoneIndex];
						const evidenceIndex = milestone.evidences.findIndex((e) => e.id === evidenceId);
						if (evidenceIndex !== -1) {
							const existingEvidence = milestone.evidences[evidenceIndex];
							const updatedEvidence: Evidence = {
								...existingEvidence,
								...evidenceData,
								updatedAt: new Date().toISOString()
							};

							const newEvidences = [...milestone.evidences];
							newEvidences[evidenceIndex] = updatedEvidence;

							const newMilestones = [...goal.milestones];
							newMilestones[milestoneIndex] = {
								...milestone,
								evidences: newEvidences,
								updatedAt: new Date().toISOString()
							};

							const newGoals = data;
							newGoals[goalIndex] = {
								...goal,
								milestones: newMilestones,
								updatedAt: new Date().toISOString()
							};

							return newGoals;
						}
					}
				}
				return data;
			});
		},

		deleteMilestoneEvidence(goalId: string, milestoneId: string, evidenceId: string) {
			updateAndSave((data) => {
				const goalIndex = data.findIndex((g) => g.id === goalId);
				if (goalIndex !== -1) {
					const goal = data[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex !== -1) {
						const milestone = goal.milestones[milestoneIndex];
						const newEvidences = milestone.evidences.filter((e) => e.id !== evidenceId);

						const newMilestones = [...goal.milestones];
						newMilestones[milestoneIndex] = {
							...milestone,
							evidences: newEvidences,
							updatedAt: new Date().toISOString()
						};

						const newGoals = data;
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return newGoals;
					}
				}
				return data;
			});
		},

		// Backup tracking methods
		getBackupTracking() {
			let currentTracking: BackupTracking;
			const unsubscribe = backupTracking.subscribe((tracking) => {
				currentTracking = tracking;
			});
			unsubscribe();
			return currentTracking!;
		},

		subscribeToBackupTracking: backupTracking.subscribe,

		markAsBackedUp() {
			backupTracking.update((tracking) => {
				const newTracking = {
					...tracking,
					lastBackup: new Date().toISOString(),
					hasUnsavedChanges: false,
					firstChangeAfterBackup: null
				};
				saveBackupTracking(newTracking);
				return newTracking;
			});
		},

		dismissSafetyReminder() {
			backupTracking.update((tracking) => {
				const newTracking = {
					...tracking,
					safetyReminderDismissedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
				};
				saveBackupTracking(newTracking);
				return newTracking;
			});
		},

		shouldShowSafetyReminder(): boolean {
			const tracking = this.getBackupTracking();

			// Don't show if no unsaved changes
			if (!tracking.hasUnsavedChanges || !tracking.firstChangeAfterBackup) {
				return false;
			}

			// Don't show if dismissed and still within 24h
			if (tracking.safetyReminderDismissedUntil) {
				const dismissedUntil = new Date(tracking.safetyReminderDismissedUntil);
				if (new Date() < dismissedUntil) {
					return false;
				}
			}

			// Show if more than 24h since first change
			const firstChange = new Date(tracking.firstChangeAfterBackup);
			const now = new Date();
			const hoursSinceFirstChange = (now.getTime() - firstChange.getTime()) / (1000 * 60 * 60);

			return hoursSinceFirstChange >= 24;
		}
	};
}

// Create the store instance
export const goalsStore = createGoalsStore();

// Derived stores for easier access to specific data
export const goals = derived(goalsStore, ($store) => $store);

export const getGoal = (goalId: string) =>
	derived(goalsStore, ($store) => $store.find((g) => g.id === goalId) || null);

export const getMilestone = (goalId: string, milestoneId: string) =>
	derived(goalsStore, ($store) => {
		const goal = $store.find((g) => g.id === goalId);
		return goal?.milestones.find((m) => m.id === milestoneId) || null;
	});

export const getTask = (goalId: string, milestoneId: string, taskId: string) =>
	derived(goalsStore, ($store) => {
		const goal = $store.find((g) => g.id === goalId);
		const milestone = goal?.milestones.find((m) => m.id === milestoneId);
		return milestone?.tasks.find((t) => t.id === taskId) || null;
	});

export const getAllTasksWithMilestones = () =>
	derived(goalsStore, ($store) => {
		const tasksWithMilestones: Array<{ task: Task; milestone: Milestone }> = [];

		$store.forEach((goal) => {
			goal.milestones.forEach((milestone) => {
				milestone.tasks.forEach((task) => {
					tasksWithMilestones.push({ task, milestone });
				});
			});
		});

		return tasksWithMilestones;
	});
