import type { Goal, Milestone, Task } from '../models/types';
import { mockGoals } from '../data/goals';

const STORAGE_KEY = 'goals-app-data';

export interface StorageData {
	goals: Goal[];
	lastUpdated: string;
}

class StorageService {
	/**
	 * Initialize storage with mock data if empty
	 */
	init(): void {
		const existing = this.getData();
		if (!existing.goals.length) {
			this.saveData({ goals: mockGoals, lastUpdated: new Date().toISOString() });
		}
	}

	/**
	 * Get all data from localStorage
	 */
	getData(): StorageData {
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			if (!data) {
				return { goals: [], lastUpdated: new Date().toISOString() };
			}

			const parsed = JSON.parse(data) as StorageData;
			// Convert date strings back to Date objects
			return {
				...parsed,
				goals: parsed.goals
			};
		} catch (error) {
			console.error('Failed to load data from localStorage:', error);
			return { goals: [], lastUpdated: new Date().toISOString() };
		}
	}

	/**
	 * Save data to localStorage
	 */
	saveData(data: StorageData): void {
		try {
			const serialized = {
				...data,
				goals: data.goals
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
		} catch (error) {
			console.error('Failed to save data to localStorage:', error);
			throw new Error('Failed to save data');
		}
	}

	/**
	 * Get all goals
	 */
	getGoals(): Goal[] {
		return this.getData().goals;
	}

	/**
	 * Get goal by ID
	 */
	getGoal(goalId: string): Goal | null {
		const goals = this.getGoals();
		return goals.find((g) => g.id === goalId) || null;
	}

	/**
	 * Update a goal
	 */
	updateGoal(goal: Goal): void {
		const data = this.getData();
		const index = data.goals.findIndex((g) => g.id === goal.id);
		if (index >= 0) {
			data.goals[index] = { ...goal, updatedAt: new Date().toISOString() };
			this.saveData({ ...data, lastUpdated: new Date().toISOString() });
		}
	}

	/**
	 * Update a milestone
	 */
	updateMilestone(goalId: string, milestone: Milestone): void {
		const goal = this.getGoal(goalId);
		if (!goal) return;

		const milestoneIndex = goal.milestones.findIndex((m) => m.id === milestone.id);
		if (milestoneIndex >= 0) {
			goal.milestones[milestoneIndex] = { ...milestone, updatedAt: new Date().toISOString() };
			this.updateGoal(goal);
		}
	}

	/**
	 * Update a task
	 */
	updateTask(goalId: string, milestoneId: string, task: Task): void {
		const goal = this.getGoal(goalId);
		if (!goal) return;

		const milestone = goal.milestones.find((m) => m.id === milestoneId);
		if (!milestone) return;

		const taskIndex = milestone.tasks.findIndex((t) => t.id === task.id);
		if (taskIndex >= 0) {
			milestone.tasks[taskIndex] = { ...task, updatedAt: new Date().toISOString() };
			this.updateGoal(goal);
		}
	}

	/**
	 * Create a new task in a milestone
	 */
	createTask(
		goalId: string,
		milestoneId: string,
		task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
	): Task {
		const goal = this.getGoal(goalId);
		if (!goal) throw new Error('Goal not found');

		const milestone = goal.milestones.find((m) => m.id === milestoneId);
		if (!milestone) throw new Error('Milestone not found');

		const newTask: Task = {
			...task,
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		milestone.tasks.push(newTask);
		this.updateGoal(goal);

		return newTask;
	}

	/**
	 * Create a new milestone in a goal
	 */
	createMilestone(
		goalId: string,
		milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>
	): Milestone {
		const goal = this.getGoal(goalId);
		if (!goal) throw new Error('Goal not found');

		const newMilestone: Milestone = {
			...milestone,
			id: crypto.randomUUID(),
			tasks: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		goal.milestones.push(newMilestone);
		this.updateGoal(goal);

		return newMilestone;
	}

	/**
	 * Find goal and milestone IDs for a given task ID
	 */
	findTaskLocation(taskId: string): { goalId: string; milestoneId: string } | null {
		const goals = this.getGoals();
		for (const goal of goals) {
			for (const milestone of goal.milestones) {
				if (milestone.tasks.some((task) => task.id === taskId)) {
					return { goalId: goal.id, milestoneId: milestone.id };
				}
			}
		}
		return null;
	}

	/**
	 * Find goal ID for a given milestone ID
	 */
	findMilestoneLocation(milestoneId: string): string | null {
		const goals = this.getGoals();
		for (const goal of goals) {
			if (goal.milestones.some((milestone) => milestone.id === milestoneId)) {
				return goal.id;
			}
		}
		return null;
	}
}

export const storageService = new StorageService();
