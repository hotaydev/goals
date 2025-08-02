import type { ValueEffortLevel } from '$lib/models/types';

// Priority calculation utilities based on Value vs Effort matrix
export function calculatePriority(value: ValueEffortLevel, effort: ValueEffortLevel): number {
	if (value === 'high' && effort === 'low') return 5; // Quick Wins
	if (value === 'high' && effort === 'high') return 4; // Strategic
	if (value === 'low' && effort === 'low') return 2; // Consider
	if (value === 'low' && effort === 'high') return 1; // Avoid
	return 1;
}

export function getPriorityLabel(priority: number): string {
	switch (priority) {
		case 5:
			return 'Quick Win';
		case 4:
			return 'Strategic';
		case 2:
			return 'Consider';
		case 1:
			return 'Avoid';
		default:
			return 'Unknown';
	}
}

export function getEffortLabel(value: ValueEffortLevel, effort: ValueEffortLevel): string {
	return `${capitalizeFirstLetter(value)} Value x ${capitalizeFirstLetter(effort)} Effort`;
}

// TODO: See if this function is needed or if we can use the getPriorityLabel function
export function getPriorityDescription(value: ValueEffortLevel, effort: ValueEffortLevel): string {
	if (value === 'high' && effort === 'low') return 'Prioritize (Quick Wins)';
	if (value === 'high' && effort === 'high') return 'Plan strategically';
	if (value === 'low' && effort === 'low') return 'Consider';
	if (value === 'low' && effort === 'high') return 'Avoid';
	return 'Unknown';
}

function capitalizeFirstLetter(val: string): string {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
