import axios from 'restyped-axios';
import {Token} from './Authentication/Token';
import {TokenStore} from './Authentication/TokenStore';
import {ApiError, isErrorResponse} from './Error';
import {IMonHunDBRoutes} from './routes';

export const client = axios.create<IMonHunDBRoutes>({
	// @ts-ignore
	baseURL: process.env.API_URL,
});

export const tokenStorageKey = 'api.auth_token';
export const tokenStore = new TokenStore(tokenStorageKey);

tokenStore.initialize();

export const login = (username: string, password: string): Promise<void> => {
	return client.post('/auth', {
		password,
		username,
	}).then(response => {
		tokenStore.setToken(new Token(response.data.token));
	});
};

export const logout = () => {
	tokenStore.setToken(null);
};

interface IAxiosError {
	response?: {
		data: any;
		status: number;
		headers: any;
	};
	request?: XMLHttpRequest;
}

const isAxiosErrorResponse = (value: any): value is IAxiosError => {
	return typeof value === 'object' && ('response' in value || 'request' in value);
};

client.interceptors.response.use(response => {
	if (isErrorResponse(response.data)) {
		const error = response.data.error;

		throw new ApiError(error.code, error.message, error.context, error.exceptions);
	}

	return response;
}, error => {
	if (!isAxiosErrorResponse(error) || !error.response || !isErrorResponse(error.response.data))
		throw error;

	const data = error.response.data.error;

	throw new ApiError(data.code, data.message, data.context, data.exceptions);
});
