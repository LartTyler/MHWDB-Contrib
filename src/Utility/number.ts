export const cleanIntegerString = (value: string, max: number = null): string => {
	let output = parseInt(value.replace(/[^\d.]/, ''), 10);

	if (isNaN(output))
		return '';

	if (max !== null)
		output = Math.min(output, max);

	return Math.abs(output).toString(10);
};
