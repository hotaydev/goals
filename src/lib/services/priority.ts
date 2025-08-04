import type { ValueEffortLevel } from '$lib/models/types';
import { m } from '$lib/paraglide/messages';

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
			return m.quick_win();
		case 4:
			return m.strategic();
		case 2:
			return m.consider();
		case 1:
			return m.avoid();
		default:
			return m.unknown();
	}
}

export function getEffortLabel(value: ValueEffortLevel, effort: ValueEffortLevel): string {
	return `${capitalizeFirstLetter(value)} Value x ${capitalizeFirstLetter(effort)} Effort`;
}

// TODO: See if this function is needed or if we can use the getPriorityLabel function
export function getPriorityDescription(value: ValueEffortLevel, effort: ValueEffortLevel): string {
	if (value === 'high' && effort === 'low') return m.prioritize_quick_wins();
	if (value === 'high' && effort === 'high') return m.plan_strategically();
	if (value === 'low' && effort === 'low') return m.consider();
	if (value === 'low' && effort === 'high') return m.avoid();
	return m.unknown();
}

function capitalizeFirstLetter(val: string): string {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
