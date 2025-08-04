import type { TargetDate } from '$lib/models/types';
import { m } from '$lib/paraglide/messages';

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
			label: m.no_target_date(),
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
		if (overdueDays < 7) {
			label = overdueDays === 1 ? m.due_1_day_overdue() : m.due_days_overdue({ days: overdueDays });
		} else if (overdueDays < 30) {
			const weeks = Math.floor(overdueDays / 7);
			label = weeks === 1 ? m.due_1_week_overdue() : m.due_weeks_overdue({ weeks });
		} else if (overdueDays < 365) {
			const months = Math.floor(overdueDays / 30);
			label = months === 1 ? m.due_1_month_overdue() : m.due_months_overdue({ months });
		} else {
			const years = Math.floor(overdueDays / 365);
			label = years === 1 ? m.due_1_year_overdue() : m.due_years_overdue({ years });
		}
	} else if (daysDiff === 0) {
		category = 'critical';
		label = m.due_today();
	} else if (daysDiff === 1) {
		category = 'critical';
		label = m.due_tomorrow();
	} else if (daysDiff <= 3) {
		category = 'critical';
		label = m.due_days_left({ days: daysDiff });
	} else if (daysDiff <= 14) {
		category = 'close';
		if (daysDiff === 7) {
			label = m.due_1_week_left();
		} else {
			label = m.due_days_left({ days: daysDiff });
		}
	} else if (daysDiff <= 60) {
		category = 'soon';
		if (daysDiff < 30) {
			const weeks = Math.floor(daysDiff / 7);
			label = weeks === 1 ? m.due_1_week_left() : m.due_weeks_left({ weeks });
		} else {
			const months = Math.floor(daysDiff / 30);
			label = months === 1 ? m.due_1_month_left() : m.due_months_left({ months });
		}
	} else {
		category = 'plenty';
		if (daysDiff < 365) {
			const months = Math.floor(daysDiff / 30);
			label = months === 1 ? m.due_1_month_left() : m.due_months_left({ months });
		} else {
			const years = Math.floor(daysDiff / 365);
			const remainingMonths = Math.floor((daysDiff % 365) / 30);
			if (years === 1 && remainingMonths === 0) {
				label = m.due_1_year_left();
			} else if (remainingMonths === 0) {
				label = m.due_years_left({ years });
			} else {
				label = m.due_years_months_left({ years, months: remainingMonths });
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
	if (!targetDate) return m.no_target_date();

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
