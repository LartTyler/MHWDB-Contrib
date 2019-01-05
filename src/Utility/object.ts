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
