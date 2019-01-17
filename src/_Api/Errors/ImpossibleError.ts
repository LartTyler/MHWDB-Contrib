export class ImpossibleError extends Error {
	public constructor() {
		super('Something unexpected happened that should not be possible. Most likely, this is due to an incorrect ' +
			'use of API response type assertions');
	}
}