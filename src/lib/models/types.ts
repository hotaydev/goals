// Core types for the Goals application

export type TaskStatus = 'planned' | 'in_progress' | 'done';
export type ValueEffortLevel = 'high' | 'low';

export interface TargetDate {
	year: number;
	month?: number;
	day?: number;
}

export interface SMARTCriteria {
	specific: string;
	measurable: string;
	achievable: string;
	relevant: string;
	timeBound: string;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	icon?: string;
	status: TaskStatus;
	value: ValueEffortLevel;
	effort: ValueEffortLevel;
	smart: SMARTCriteria;
	targetDate: TargetDate;
	createdAt: string;
	updatedAt: string;
}

export interface Milestone {
	id: string;
	title: string;
	description: string;
	icon?: string;
	value: ValueEffortLevel;
	effort: ValueEffortLevel;
	smart: SMARTCriteria;
	targetDate: TargetDate;
	tasks: Task[];
	createdAt: string;
	updatedAt: string;
}

export interface Goal {
	id: string;
	title: string;
	description: string;
	icon?: string;
	targetDate: TargetDate;
	smart: SMARTCriteria;
	milestones: Milestone[];
	createdAt: string;
	updatedAt: string;
}

export interface GoalCardProps {
	goal: Goal;
	onclick?: () => void;
}
