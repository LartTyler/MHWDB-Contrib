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

export const isErrorResponse = (value: any): value is IErrorResponse => {
	return typeof value === 'object' && 'error' in value;
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
