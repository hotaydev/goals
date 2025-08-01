import type { TargetDate } from '$lib/models/types';

export type TimeCategory = 'overdue' | 'critical' | 'close' | 'soon' | 'plenty';

export interface TimeRemaining {
	days: number;
	category: TimeCategory;
	label: string;
	isOverdue: boolean;
}

/**
 * Convert a TargetDate to an actual Date object
 * @param targetDate - The target date object with year, optional month and day
 * @returns Date object or null if invalid
 */
export function targetDateToDate(targetDate?: TargetDate): Date | null {
	if (!targetDate) return null;

	const { year, month = 12, day = 31 } = targetDate;

	// If only year is provided, use end of year
	// If year and month, use end of month
	// If year, month, and day, use that specific date
	if (targetDate.day && targetDate.month) {
		return new Date(year, month - 1, day);
	} else if (targetDate.month) {
		// Last day of the month
		return new Date(year, month, 0);
	} else {
		// Last day of the year
		return new Date(year, 11, 31);
	}
}

/**
 * Calculate time remaining until target date
 * @param targetDate - The target date object
 * @param fromDate - The date to calculate from (defaults to today)
 * @returns TimeRemaining object with days, category, and label
 */
export function calculateTimeRemaining(
	targetDate?: TargetDate,
	fromDate: Date = new Date()
): TimeRemaining {
	const target = targetDateToDate(targetDate);

	if (!target) {
		return {
			days: 0,
			category: 'plenty',
			label: 'No target date',
			isOverdue: false
		};
	}

	// Calculate difference in days
	const timeDiff = target.getTime() - fromDate.getTime();
	const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

	// Determine category and label
	let category: TimeCategory;
	let label: string;
	const isOverdue = daysDiff < 0;

	if (isOverdue) {
		const overdueDays = Math.abs(daysDiff);
		category = 'overdue';
		if (overdueDays === 1) {
			label = '1 day overdue';
		} else if (overdueDays < 7) {
			label = `${overdueDays} days overdue`;
		} else if (overdueDays < 30) {
			const weeks = Math.floor(overdueDays / 7);
			label = weeks === 1 ? '1 week overdue' : `${weeks} weeks overdue`;
		} else if (overdueDays < 365) {
			const months = Math.floor(overdueDays / 30);
			label = months === 1 ? '1 month overdue' : `${months} months overdue`;
		} else {
			const years = Math.floor(overdueDays / 365);
			label = years === 1 ? '1 year overdue' : `${years} years overdue`;
		}
	} else if (daysDiff === 0) {
		category = 'critical';
		label = 'Due today';
	} else if (daysDiff === 1) {
		category = 'critical';
		label = 'Due tomorrow';
	} else if (daysDiff <= 3) {
		category = 'critical';
		label = `${daysDiff} days left`;
	} else if (daysDiff <= 14) {
		category = 'close';
		if (daysDiff === 7) {
			label = '1 week left';
		} else {
			label = `${daysDiff} days left`;
		}
	} else if (daysDiff <= 60) {
		category = 'soon';
		if (daysDiff < 30) {
			const weeks = Math.floor(daysDiff / 7);
			label = weeks === 1 ? '1 week left' : `${weeks} weeks left`;
		} else {
			const months = Math.floor(daysDiff / 30);
			label = months === 1 ? '1 month left' : `${months} months left`;
		}
	} else {
		category = 'plenty';
		if (daysDiff < 365) {
			const months = Math.floor(daysDiff / 30);
			label = months === 1 ? '1 month left' : `${months} months left`;
		} else {
			const years = Math.floor(daysDiff / 365);
			const remainingMonths = Math.floor((daysDiff % 365) / 30);
			if (years === 1 && remainingMonths === 0) {
				label = '1 year left';
			} else if (remainingMonths === 0) {
				label = `${years} years left`;
			} else {
				label = `${years}y ${remainingMonths}m left`;
			}
		}
	}

	return {
		days: daysDiff,
		category,
		label,
		isOverdue
	};
}

/**
 * Format a target date object to a human-readable string
 * @param targetDate - The target date object with year, optional month and day
 * @param options - Formatting options
 * @returns Formatted date string or fallback message for invalid dates
 */
export function formatTargetDate(
	targetDate?: TargetDate,
	options: { monthFormat?: 'short' | 'long' } = {}
): string {
	if (!targetDate) return 'No target date';

	const { year, month, day } = targetDate;
	const { monthFormat = 'short' } = options;

	// Full date: day, month, and year
	if (day && month) {
		return new Date(year, month - 1, day).toLocaleDateString(undefined, {
			year: 'numeric',
			month: monthFormat,
			day: 'numeric'
		});
	}

	// Month and year only
	if (month) {
		return new Date(year, month - 1).toLocaleDateString(undefined, {
			year: 'numeric',
			month: monthFormat
		});
	}

	// Year only
	return year.toString();
}

/**
 * Format a regular Date object to a short, readable format
 * @param dateObj - The Date object to format
 * @returns Formatted date string
 */
export function formatDate(dateObj: Date): string {
	return dateObj.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}
