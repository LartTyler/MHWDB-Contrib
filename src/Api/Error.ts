export interface IStackTraceItem {
	namespace: string;
	short_class: string;
	class: string;
	type: string;
	function: string;
	file: string;
	line: number;
}

export interface IExceptionTrace {
	message: string;
	class: string;
	trace: IStackTraceItem[];
}

export interface IErrorResponse<T extends object = {}> {
	error: {
		code: string;
		message: string;

		exceptions?: IExceptionTrace[];
		context?: T;
	};
}

export interface IValidationFailure {
	code: string;
	path: string;
	message: string;
}

export interface IValidationFailures {
	[key: string]: IValidationFailure;
}

export interface IValidationFailureContext {
	failures: IValidationFailures;
}

export const isErrorResponse = (value: any): value is IErrorResponse => {
	return typeof value === 'object' && 'error' in value;
};

export const isValidationFailedError = (value: any): value is ApiError<IValidationFailureContext> => {
	return value instanceof Error && (value as ApiError).code === 'validation_failed';
};

export class ApiError<T = {}> extends Error {
	public readonly code: string;
	public readonly context: T;
	public readonly exceptions: IExceptionTrace[];

	public constructor(code: string, message: string, context?: T, exceptions?: IExceptionTrace[]) {
		super(message);

		this.code = code;
		this.context = context;
		this.exceptions = exceptions;
	}
}
