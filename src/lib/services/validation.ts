import type { Goal, TaskStatus, ValueEffortLevel } from '../models/types';
import { m } from '$lib/paraglide/messages';

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export interface ImportValidationResult extends ValidationResult {
	data?: Goal[];
}

// Shared constants
const URL_REGEX =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const TASK_STATUSES: TaskStatus[] = ['planned', 'in_progress', 'done'];
const VALUE_EFFORT_LEVELS: ValueEffortLevel[] = ['high', 'low'];
const EVIDENCE_TYPES = ['link', 'note'] as const;

// Type guards for better type safety
function isString(value: unknown): value is string {
	return typeof value === 'string';
}

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

function isNumber(value: unknown): value is number {
	return typeof value === 'number' && !isNaN(value);
}

/**
 * Validates if a value is a non-empty string
 */
function isValidString(value: unknown, fieldName: string): string | null {
	if (!isString(value) || value.trim() === '') {
		return m.validation_error_required_string({ fieldName });
	}
	return null;
}

/**
 * Validates if a value is a valid ISO date string
 */
function isValidDateString(value: unknown, fieldName: string): string | null {
	if (!isString(value)) {
		return m.validation_error_must_be_string({ fieldName });
	}

	const date = new Date(value);
	if (isNaN(date.getTime())) {
		return m.validation_error_must_be_valid_iso_date_string({ fieldName });
	}
	return null;
}

/**
 * Validates if a value is a valid URL
 */
function isValidUrl(value: string, fieldName: string): string | null {
	if (!URL_REGEX.test(value)) {
		return m.validation_error_must_be_valid_url({ fieldName });
	}
	return null;
}

/**
 * Exported function to validate URLs for use in components
 */
export function isValidUrlString(url: string): boolean {
	return URL_REGEX.test(url);
}

/**
 * Validates if a value is one of the allowed values
 */
function isValidEnum<T extends string>(
	value: unknown,
	allowedValues: readonly T[],
	fieldName: string
): string | null {
	if (!isString(value) || !(allowedValues as readonly string[]).includes(value)) {
		return m.validation_error_must_be_one_of({
			fieldName,
			allowedValues: allowedValues.join(', ')
		});
	}
	return null;
}

/**
 * Validates if a value is a valid year number
 */
function isValidYear(value: unknown, fieldName: string): string | null {
	if (!isNumber(value) || value < 1900 || value > 3000) {
		return m.validation_error_must_be_valid_year_number({ fieldName });
	}
	return null;
}

/**
 * Validates if a value is a valid month number
 */
function isValidMonth(value: unknown, fieldName: string): string | null {
	if (!isNumber(value) || value < 1 || value > 12) {
		return m.validation_error_must_be_valid_month_number({ fieldName });
	}
	return null;
}

/**
 * Validates if a value is a valid day number
 */
function isValidDay(value: unknown, fieldName: string): string | null {
	if (!isNumber(value) || value < 1 || value > 31) {
		return m.validation_error_must_be_valid_day_number({ fieldName });
	}
	return null;
}

/**
 * Validates required string fields on an object
 */
function validateRequiredStringFields(
	obj: Record<string, unknown>,
	fields: string[],
	prefix: string
): string[] {
	const errors: string[] = [];
	for (const field of fields) {
		const error = isValidString(obj[field], `${prefix}.${field}`);
		if (error) errors.push(error);
	}
	return errors;
}

/**
 * Validates required string fields on an object
 */
function validateRequiredStringFieldsAsEmptyString(
	obj: Record<string, unknown>,
	fields: string[],
	prefix: string
): string[] {
	const errors: string[] = [];
	for (const field of fields) {
		if (!isString(obj[field])) {
			errors.push(m.validation_error_required_string({ fieldName: `${prefix}.${field}` }));
		}
	}
	return errors;
}

/**
 * Validates optional string fields on an object
 */
function validateOptionalStringFields(
	obj: Record<string, unknown>,
	fields: string[],
	prefix: string
): string[] {
	const errors: string[] = [];
	for (const field of fields) {
		if (obj[field] !== undefined) {
			const error = isValidString(obj[field], `${prefix}.${field}`);
			if (error) errors.push(error);
		}
	}
	return errors;
}

/**
 * Validates date fields on an object
 */
function validateDateFields(
	obj: Record<string, unknown>,
	fields: string[],
	prefix: string
): string[] {
	const errors: string[] = [];
	for (const field of fields) {
		const error = isValidDateString(obj[field], `${prefix}.${field}`);
		if (error) errors.push(error);
	}
	return errors;
}

/**
 * Validates SMART criteria object
 */
function validateSMARTCriteria(smart: unknown, prefix: string): string[] {
	const errors: string[] = [];

	if (!isObject(smart)) {
		errors.push(m.validation_error_must_be_object({ fieldName: `${prefix}.smart` }));
		return errors;
	}

	const fields = ['specific', 'measurable', 'achievable', 'relevant', 'timeBound'];
	errors.push(...validateRequiredStringFieldsAsEmptyString(smart, fields, `${prefix}.smart`));

	return errors;
}

/**
 * Validates evidence object
 */
function validateEvidence(evidence: unknown, prefix: string): string[] {
	const errors: string[] = [];

	if (!isObject(evidence)) {
		errors.push(m.validation_error_must_be_object({ fieldName: `${prefix}` }));
		return errors;
	}

	// Required string fields
	errors.push(...validateRequiredStringFields(evidence, ['id', 'title'], prefix));
	errors.push(...validateRequiredStringFieldsAsEmptyString(evidence, ['content'], prefix));

	// Optional string fields
	errors.push(...validateOptionalStringFields(evidence, ['icon'], prefix));

	// Type validation
	const typeError = isValidEnum(evidence.type, EVIDENCE_TYPES, `${prefix}.type`);
	if (typeError) errors.push(typeError);

	// URL validation for link type
	if (evidence.type === 'link' && isString(evidence.content)) {
		const urlError = isValidUrl(evidence.content, `${prefix}.content`);
		if (urlError) errors.push(urlError);
	}

	// Date fields
	errors.push(...validateDateFields(evidence, ['createdAt', 'updatedAt'], prefix));

	return errors;
}

/**
 * Validates target date object
 */
function validateTargetDate(targetDate: unknown, prefix: string): string[] {
	const errors: string[] = [];

	if (!isObject(targetDate)) {
		errors.push(m.validation_error_must_be_object({ fieldName: `${prefix}.targetDate` }));
		return errors;
	}

	// Year is required
	const yearError = isValidYear(targetDate.year, `${prefix}.targetDate.year`);
	if (yearError) errors.push(yearError);

	// Month and day are optional
	if (targetDate.month !== undefined) {
		const monthError = isValidMonth(targetDate.month, `${prefix}.targetDate.month`);
		if (monthError) errors.push(monthError);
	}

	if (targetDate.day !== undefined) {
		const dayError = isValidDay(targetDate.day, `${prefix}.targetDate.day`);
		if (dayError) errors.push(dayError);
	}

	return errors;
}

/**
 * Validates value and effort fields
 */
function validateValueEffortFields(obj: Record<string, unknown>, prefix: string): string[] {
	const errors: string[] = [];

	const valueError = isValidEnum(obj.value, VALUE_EFFORT_LEVELS, `${prefix}.value`);
	if (valueError) errors.push(valueError);

	const effortError = isValidEnum(obj.effort, VALUE_EFFORT_LEVELS, `${prefix}.effort`);
	if (effortError) errors.push(effortError);

	return errors;
}

/**
 * Validates an array of objects using a validation function
 */
function validateArray(
	array: unknown,
	validator: (item: unknown, prefix: string) => string[],
	prefix: string
): string[] {
	const errors: string[] = [];

	if (!isArray(array)) {
		errors.push(m.validation_error_must_be_array({ fieldName: prefix }));
		return errors;
	}

	array.forEach((item, index) => {
		errors.push(...validator(item, `${prefix}[${index}]`));
	});

	return errors;
}

/**
 * Validates a task object
 */
function validateTask(task: unknown, prefix: string): string[] {
	const errors: string[] = [];

	if (!isObject(task)) {
		errors.push(m.validation_error_must_be_object({ fieldName: prefix }));
		return errors;
	}

	// Required string fields
	errors.push(...validateRequiredStringFields(task, ['id', 'title'], prefix));
	errors.push(...validateRequiredStringFieldsAsEmptyString(task, ['description'], prefix));

	// Optional string fields
	errors.push(...validateOptionalStringFields(task, ['icon'], prefix));

	// Status validation
	const statusError = isValidEnum(task.status, TASK_STATUSES, `${prefix}.status`);
	if (statusError) errors.push(statusError);

	// Value and effort validation
	errors.push(...validateValueEffortFields(task, prefix));

	// Date fields
	errors.push(...validateDateFields(task, ['createdAt', 'updatedAt'], prefix));

	// Complex object validation
	errors.push(...validateTargetDate(task.targetDate, prefix));

	// Evidences array validation
	errors.push(...validateArray(task.evidences, validateEvidence, `${prefix}.evidences`));

	return errors;
}

/**
 * Validates a milestone object
 */
function validateMilestone(milestone: unknown, prefix: string): string[] {
	const errors: string[] = [];

	if (!isObject(milestone)) {
		errors.push(m.validation_error_must_be_object({ fieldName: prefix }));
		return errors;
	}

	// Required string fields
	errors.push(...validateRequiredStringFields(milestone, ['id', 'title'], prefix));
	errors.push(...validateRequiredStringFieldsAsEmptyString(milestone, ['description'], prefix));

	// Optional string fields
	errors.push(...validateOptionalStringFields(milestone, ['icon'], prefix));

	// Value and effort validation
	errors.push(...validateValueEffortFields(milestone, prefix));

	// Date fields
	errors.push(...validateDateFields(milestone, ['createdAt', 'updatedAt'], prefix));

	// Complex object validation
	errors.push(...validateSMARTCriteria(milestone.smart, prefix));
	errors.push(...validateTargetDate(milestone.targetDate, prefix));

	// Evidences array validation
	errors.push(...validateArray(milestone.evidences, validateEvidence, `${prefix}.evidences`));

	// Tasks array validation
	errors.push(...validateArray(milestone.tasks, validateTask, `${prefix}.tasks`));

	return errors;
}

/**
 * Validates a goal object
 */
function validateGoal(goal: unknown, prefix: string): string[] {
	const errors: string[] = [];

	if (!isObject(goal)) {
		errors.push(m.validation_error_must_be_object({ fieldName: prefix }));
		return errors;
	}

	// Required string fields
	errors.push(...validateRequiredStringFields(goal, ['id', 'title'], prefix));
	errors.push(...validateRequiredStringFieldsAsEmptyString(goal, ['description'], prefix));

	// Optional string fields
	errors.push(...validateOptionalStringFields(goal, ['icon'], prefix));

	// Date fields
	errors.push(...validateDateFields(goal, ['createdAt', 'updatedAt'], prefix));

	// Complex object validation
	errors.push(...validateSMARTCriteria(goal.smart, prefix));
	errors.push(...validateTargetDate(goal.targetDate, prefix));

	// Milestones array validation
	errors.push(...validateArray(goal.milestones, validateMilestone, `${prefix}.milestones`));

	return errors;
}

/**
 * Validates imported JSON data for the goals application
 */
export function validateImportData(jsonData: unknown): ImportValidationResult {
	const errors: string[] = [];

	// Check if goals array exists
	if (!isArray(jsonData)) {
		return {
			isValid: false,
			errors: [m.validation_error_must_be_array({ fieldName: 'goals' })]
		};
	}

	// Validate each goal
	errors.push(...validateArray(jsonData, validateGoal, 'goals'));

	// If no lastUpdated, add current timestamp
	const validatedData: Goal[] = jsonData as Goal[];

	return {
		isValid: errors.length === 0,
		errors,
		data: errors.length === 0 ? validatedData : undefined
	};
}

/**
 * Quick validation to check if JSON has basic structure (for file type checking)
 */
export function hasBasicStructure(jsonData: unknown): boolean {
	return isArray(jsonData);
}
