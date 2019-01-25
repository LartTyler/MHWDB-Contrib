export type StringValues<T> = {
	[P in keyof T]: string;
};

export type NumberValues<T> = {
	[P in keyof T]: number;
};

export const toStringValues = <T>(object: NumberValues<T>): StringValues<T> => {
	return Object.keys(object).reduce((output, key) => {
		output[key as keyof T] = object[key as keyof T].toString(10);

		return output;
	}, {} as StringValues<T>);
};

export const compareFields = <T>(key: keyof T, a: T, b: T): number => {
	if (a === b)
		return 0;

	const aval = a[key];
	const bval = b[key];

	if (aval === bval)
		return 0;
	else if (aval > bval)
		return 1;

	return -1;
};
