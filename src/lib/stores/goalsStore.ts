import { writable, derived } from 'svelte/store';
import type { Goal, Milestone, Task } from '../models/types';
import { mockGoals } from '../data/goals';
import { browser } from '$app/environment';

const STORAGE_KEY = 'goals-app-data';

export interface StorageData {
	goals: Goal[];
	lastUpdated: string;
}

// Helper function to load data from localStorage
function loadFromStorage(): StorageData {
	if (!browser) {
		return { goals: mockGoals, lastUpdated: new Date().toISOString() };
	}

	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) {
			return { goals: mockGoals, lastUpdated: new Date().toISOString() };
		}

		const parsed = JSON.parse(data) as StorageData;
		return {
			...parsed,
			goals: parsed.goals.length > 0 ? parsed.goals : mockGoals
		};
	} catch (error) {
		console.error('Failed to load data from localStorage:', error);
		return { goals: mockGoals, lastUpdated: new Date().toISOString() };
	}
}

// Helper function to save data to localStorage
function saveToStorage(data: StorageData): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		// Note: Don't manually dispatch storage events - localStorage does this automatically for other tabs
	} catch (error) {
		console.error('Failed to save data to localStorage:', error);
	}
}

// Create the main store
function createGoalsStore() {
	const initialData = loadFromStorage();
	const { subscribe, set, update } = writable<StorageData>(initialData);

	// Helper function to update store and save to localStorage
	function updateAndSave(updater: (data: StorageData) => StorageData) {
		update((data) => {
			const newData = updater(data);
			if (browser) {
				saveToStorage(newData);
			}
			return newData;
		});
	}

	// Listen for storage changes from other tabs/windows only
	if (browser) {
		window.addEventListener('storage', (e) => {
			if (e.key === STORAGE_KEY && e.newValue) {
				try {
					const newData = JSON.parse(e.newValue) as StorageData;
					set(newData); // Don't save back to localStorage - this came from another tab
				} catch (error) {
					console.error('Failed to parse storage event data:', error);
				}
			}
		});
	}

	return {
		subscribe,

		// Initialize store (called once at app startup)
		init() {
			const data = loadFromStorage();
			set(data);
			if (browser) {
				saveToStorage(data); // Ensure localStorage is in sync
			}
		},

		// Goal operations
		updateGoal(updatedGoal: Goal) {
			updateAndSave((data) => {
				const index = data.goals.findIndex((g) => g.id === updatedGoal.id);
				if (index >= 0) {
					// Create new objects to ensure reactivity
					const newGoals = [...data.goals];
					newGoals[index] = {
						...updatedGoal,
						updatedAt: new Date().toISOString()
					};

					return {
						...data,
						goals: newGoals,
						lastUpdated: new Date().toISOString()
					};
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
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
				return {
					...data,
					goals: [...data.goals, goal],
					lastUpdated: new Date().toISOString()
				};
			});
		},

		deleteGoal(goalId: string) {
			updateAndSave((data) => ({
				...data,
				goals: data.goals.filter((g) => g.id !== goalId),
				lastUpdated: new Date().toISOString()
			}));
		},

		// Milestone operations
		updateMilestone(goalId: string, updatedMilestone: Milestone) {
			updateAndSave((data) => {
				const goalIndex = data.goals.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data.goals[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === updatedMilestone.id);
					if (milestoneIndex >= 0) {
						// Create new objects to ensure reactivity
						const newMilestones = [...goal.milestones];
						newMilestones[milestoneIndex] = {
							...updatedMilestone,
							updatedAt: new Date().toISOString()
						};

						const newGoals = [...data.goals];
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return {
							...data,
							goals: newGoals,
							lastUpdated: new Date().toISOString()
						};
					}
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
			});
		},

		addMilestone(
			goalId: string,
			newMilestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.goals.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data.goals[goalIndex];
					const milestone: Milestone = {
						...newMilestone,
						id: crypto.randomUUID(),
						tasks: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					};

					// Create new objects to ensure reactivity
					const newMilestones = [...goal.milestones, milestone];

					const newGoals = [...data.goals];
					newGoals[goalIndex] = {
						...goal,
						milestones: newMilestones,
						updatedAt: new Date().toISOString()
					};

					return {
						...data,
						goals: newGoals,
						lastUpdated: new Date().toISOString()
					};
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
			});
		},

		deleteMilestone(goalId: string, milestoneId: string) {
			updateAndSave((data) => {
				const goalIndex = data.goals.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data.goals[goalIndex];

					// Create new objects to ensure reactivity
					const newMilestones = goal.milestones.filter((m) => m.id !== milestoneId);

					const newGoals = [...data.goals];
					newGoals[goalIndex] = {
						...goal,
						milestones: newMilestones,
						updatedAt: new Date().toISOString()
					};

					return {
						...data,
						goals: newGoals,
						lastUpdated: new Date().toISOString()
					};
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
			});
		},

		// Task operations
		updateTask(goalId: string, milestoneId: string, updatedTask: Task) {
			updateAndSave((data) => {
				const goalIndex = data.goals.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data.goals[goalIndex];
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

							const newGoals = [...data.goals];
							newGoals[goalIndex] = {
								...goal,
								milestones: newMilestones,
								updatedAt: new Date().toISOString()
							};

							return {
								...data,
								goals: newGoals,
								lastUpdated: new Date().toISOString()
							};
						}
					}
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
			});
		},

		addTask(
			goalId: string,
			milestoneId: string,
			newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
		) {
			updateAndSave((data) => {
				const goalIndex = data.goals.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data.goals[goalIndex];
					const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestoneId);
					if (milestoneIndex >= 0) {
						const milestone = goal.milestones[milestoneIndex];
						const task: Task = {
							...newTask,
							id: crypto.randomUUID(),
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

						const newGoals = [...data.goals];
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return {
							...data,
							goals: newGoals,
							lastUpdated: new Date().toISOString()
						};
					}
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
			});
		},

		deleteTask(goalId: string, milestoneId: string, taskId: string) {
			updateAndSave((data) => {
				const goalIndex = data.goals.findIndex((g) => g.id === goalId);
				if (goalIndex >= 0) {
					const goal = data.goals[goalIndex];
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

						const newGoals = [...data.goals];
						newGoals[goalIndex] = {
							...goal,
							milestones: newMilestones,
							updatedAt: new Date().toISOString()
						};

						return {
							...data,
							goals: newGoals,
							lastUpdated: new Date().toISOString()
						};
					}
				}
				return {
					...data,
					lastUpdated: new Date().toISOString()
				};
			});
		},

		// Utility functions for finding data
		findTaskLocation(taskId: string): { goalId: string; milestoneId: string } | null {
			let currentData: StorageData;
			const unsubscribe = subscribe((data) => {
				currentData = data;
			});
			unsubscribe();

			for (const goal of currentData!.goals) {
				for (const milestone of goal.milestones) {
					if (milestone.tasks.some((task) => task.id === taskId)) {
						return { goalId: goal.id, milestoneId: milestone.id };
					}
				}
			}
			return null;
		},

		findMilestoneLocation(milestoneId: string): string | null {
			let currentData: StorageData;
			const unsubscribe = subscribe((data) => {
				currentData = data;
			});
			unsubscribe();

			for (const goal of currentData!.goals) {
				if (goal.milestones.some((milestone) => milestone.id === milestoneId)) {
					return goal.id;
				}
			}
			return null;
		}
	};
}

// Create the store instance
export const goalsStore = createGoalsStore();

// Derived stores for easier access to specific data
export const goals = derived(goalsStore, ($store) => $store.goals);

export const getGoal = (goalId: string) =>
	derived(goalsStore, ($store) => $store.goals.find((g) => g.id === goalId) || null);

export const getMilestone = (goalId: string, milestoneId: string) =>
	derived(goalsStore, ($store) => {
		const goal = $store.goals.find((g) => g.id === goalId);
		return goal?.milestones.find((m) => m.id === milestoneId) || null;
	});

export const getTask = (goalId: string, milestoneId: string, taskId: string) =>
	derived(goalsStore, ($store) => {
		const goal = $store.goals.find((g) => g.id === goalId);
		const milestone = goal?.milestones.find((m) => m.id === milestoneId);
		return milestone?.tasks.find((t) => t.id === taskId) || null;
	});
