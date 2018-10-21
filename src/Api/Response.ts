export interface IAuthResponse {
	token: string;
}

export interface IErrorResponse {
	error: {
		code: string;
		message: string;
	};
}

export const isAuthResponse = (object: any): object is IAuthResponse => {
	return object !== null && typeof object === 'object' && 'token' in object;
};

export const isErrorResponse = (object: any): object is IErrorResponse => {
	return object !== null && typeof object === 'object' && 'error' in object;
};

export const isArrayResponse = (value: any): value is any[] => {
	return value !== null && typeof value === 'object' && value.constructor === Array;
};

export const isObjectArrayResponse = (value: any): value is object[] => {
	return isArrayResponse(value) && (value.length === 0 || typeof value[0] === 'object');
};

export const isObjectResponse = (value: any): value is object => {
	return value !== null && typeof value === 'object' && value.constructor !== Array;
};
