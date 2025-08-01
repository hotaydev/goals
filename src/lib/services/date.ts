import type { TargetDate } from '$lib/models/types';

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
