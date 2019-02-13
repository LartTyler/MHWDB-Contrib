export const numberRegex = /^-?\d*\.?\d+$/;

export const cleanPositiveIntegerString = (value: string, max: number = null): string => {
	let output = parseInt(value.replace(/[^\d.]/, ''), 10);

	if (isNaN(output))
		return '';

	if (max !== null)
		output = Math.min(output, max);

	return Math.abs(output).toString(10);
};

export const cleanNumberString = (
	value: string,
	allowNegative: boolean = true,
	sanitizeRegex: RegExp = /[^\d]/g,
): string => {
	let output = value.replace(sanitizeRegex, '');

	if (allowNegative && value.charAt(0) === '-')
		output = `-${output}`;

	return output;
};
