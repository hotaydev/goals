// Core types for the Goals application

export type TaskStatus = 'planned' | 'in_progress' | 'done';
export type ValueEffortLevel = 'high' | 'low';

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
	createdAt: Date;
	updatedAt: Date;
}

export interface Milestone {
	id: string;
	title: string;
	description: string;
	icon?: string;
	value: ValueEffortLevel;
	effort: ValueEffortLevel;
	smart: SMARTCriteria;
	tasks: Task[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Goal {
	id: string;
	title: string;
	description: string;
	icon?: string;
	targetDate: {
		year: number;
		month?: number;
		day?: number;
	};
	smart: SMARTCriteria;
	milestones: Milestone[];
	createdAt: Date;
	updatedAt: Date;
}

export interface GoalCardProps {
	goal: Goal;
	onclick?: () => void;
}
