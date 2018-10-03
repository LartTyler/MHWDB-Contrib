import {ApiError} from './Errors/ApiError';
import {Token} from './Token';

interface RequestParams {
	[key: string]: string | number | boolean | object;
}

interface AuthResponse {
	token: string;
}

interface ErrorResponse {
	error: {
		code: string;
		message: string;
	};
}

const isAuthResponse = (object: unknown): object is AuthResponse => {
	return typeof object === 'object' && 'token' in object;
};

const isErrorResponse = (object: unknown): object is ErrorResponse => {
	return typeof object === 'object' && 'error' in object;
};

export class ApiClient {
	protected baseUrl: string;

	protected token: Token = null;

	protected tokenRefreshId: number = null;

	public constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	public isAuthenticated(): boolean {
		return this.token !== null;
	}

	public login(email: string, password: string): Promise<void> {
		return this.fetch('POST', '/auth', {
			username: email,
			password: password,
		}).then(response => {
			if (!isAuthResponse(response))
				throw new Error('Invalid response from the API');

			this.setToken(response.token);
		});
	}

	public refresh(): Promise<void> {
		return this.fetch('GET', '/auth/refresh').then(response => {
			if (!isAuthResponse(response))
				throw new Error('Invalid response from the API');

			this.setToken(response.token);
		});
	}

	protected fetch(method: string, path: string, parameters?: RequestParams): Promise<object | Array<object>> {
		if (path.charAt(0) === '/')
			path = path.substr(1);

		const url = new URL(path, this.baseUrl);
		const headers = new Headers();
		const request: RequestInit = {
			method: method.toUpperCase(),
			headers: headers,
		};

		if (parameters) {
			if (request.method === 'GET') {
				for (let key in parameters) {
					const value = parameters[key];

					if (typeof value === 'object')
						url.searchParams.set(key, JSON.stringify(value));
					else if (typeof value === 'boolean' && value)
						url.searchParams.set(key, '');
					else if (typeof value === 'number')
						url.searchParams.set(key, value.toString(10));
				}
			} else
				request.body = JSON.stringify(parameters);
		}

		if (this.token !== null)
			headers.set('Authorization', `Bearer ${this.token.jwt}`);

		return fetch(url.href, request)
			.then(response => {
				if (!response.ok)
					throw new Error(response.statusText);

				return response.json();
			})
			.then(response => {
				if (isErrorResponse(response))
					throw new ApiError(response.error.code, response.error.message);

				return response;
			});
	}

	protected setToken(token: string): void {
		if (this.tokenRefreshId !== null) {
			window.clearTimeout(this.tokenRefreshId);

			this.tokenRefreshId = null;
		}

		if (token === null)
			this.token = null;
		else {
			this.token = new Token(token);

			this.tokenRefreshId = window.setTimeout(() => {
				this.tokenRefreshId = null;

				this.refresh();
			}, this.token.getExpiration() - Math.floor(Date.now() / 1000) - 15);
		}
	}
}