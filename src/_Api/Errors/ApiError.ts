export class ApiError extends Error {
	public readonly code: string;

	public constructor(code: string, message: string) {
		super(message);

		this.code = code;
	}
}