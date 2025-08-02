import type { Task, Milestone, TaskStatus } from '$lib/models/types';
import { calculatePriority } from './priority';

export function getGoalCompletionPercentage(milestones: Milestone[]): number {
	if (milestones.length === 0) return 0;

	let totalPoints = 0;
	let completedPoints = 0;

	for (const milestone of milestones) {
		const priorityPoints = calculatePriority(milestone.value, milestone.effort);
		const milestoneCompletionPercentage = getMilestoneCompletionPercentage(milestone.tasks);

		totalPoints += priorityPoints;
		completedPoints += priorityPoints * (milestoneCompletionPercentage / 100);
	}

	const percentage = (completedPoints / totalPoints) * 100;
	return Math.round(percentage * 10) / 10; // Round to 1 decimal place
}

export function getMilestoneCompletionPercentage(tasks: Task[]): number {
	if (tasks.length === 0) return 0;

	let totalPoints = 0;
	let completedPoints = 0;

	for (const task of tasks) {
		const priorityPoints = calculatePriority(task.value, task.effort);
		totalPoints += priorityPoints;
		completedPoints += priorityPoints * getTaskPointsBasedOnStatus(task.status);
	}

	const percentage = (completedPoints / totalPoints) * 100;
	return Math.round(percentage * 10) / 10; // Round to 1 decimal place
}

function getTaskPointsBasedOnStatus(status: TaskStatus): number {
	if (status === 'done') return 1;
	if (status === 'in_progress') return 0.25; // In Progress tasks are worth 25% of the priority points
	return 0;
}
