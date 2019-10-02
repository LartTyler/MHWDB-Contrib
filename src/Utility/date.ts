export const formatDateTime = (date: Date) => {
	return `${date.toLocaleDateString()} ${date.toLocaleTimeString().replace(':00 ', ' ')}`;
};

export const parseIso8601Date = (input: string): Date => {
	// Fix for Safari not understanding TZ parts in the format "hhmm"
	// @see https://github.com/LartTyler/MHWDB-Contrib/issues/31
	if (/[+-]\d{4}$/.test(input)) {
		const tzPart = input.substr(input.length - 4);

		input = `${input.substr(0, input.length - 4)}${tzPart.substr(0, 2)}:${tzPart.substr(2)}`;
	}

	return new Date(input);
};
