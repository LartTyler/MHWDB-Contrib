import {ApiError} from './Errors/ApiError';
import {ImpossibleError} from './Errors/ImpossibleError';
import {Ailment, assertAilmentArray} from './Objects/Ailment';
import {Token} from './Token';

interface RequestParams {
	[key: string]: string | number | boolean | object;
}

interface Projection {
	[key: string]: boolean;
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

const isArrayResponse = (value: unknown): value is object[] => {
	return typeof value === 'object' && value.constructor === Array;
};

const authTokenStorageKey = 'api.auth_token';

export class ApiClient {
	protected baseUrl: string;

	protected token: Token = null;
	protected tokenRefreshId: number = null;

	public constructor(baseUrl: string) {
		this.baseUrl = baseUrl;

		const jwt = window.localStorage.getItem(authTokenStorageKey);

		if (jwt)
			this.setToken(jwt);
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

	public logout(): void {
		this.setToken(null);
	}

	public listAilments(query?: RequestParams, project?: Projection): Promise<Ailment[]> {
		return this.list('/ailments', query, project).then(data => {
			if (!assertAilmentArray(data))
				throw new ImpossibleError();

			return data;
		});
	}

	protected list(path: string, query?: RequestParams, project?: Projection): Promise<object[]> {
		const params: {q?: RequestParams, p?: Projection} = {};

		if (query)
			params.q = query;

		if (project)
			params.p = project;

		return this.fetch('GET', path, params).then(data => {
			if (!isArrayResponse(data))
				throw new Error('Expected array response from API');

			return data;
		});
	}

	protected fetch(method: string, path: string, parameters?: RequestParams): Promise<object | object[]> {
		if (path.charAt(0) === '/')
			path = path.substr(1);

		const url = new URL(path, this.baseUrl);
		const headers = new Headers({
			'Content-Type': 'application/json',
		});

		const request: RequestInit = {
			method: method.toUpperCase(),
			headers: headers,
		};

		if (parameters && Object.keys(parameters).length > 0) {
			if (request.method === 'GET') {
				for (let key in parameters) {
					const value = parameters[key];

					switch (typeof value) {
						case 'object':
							url.searchParams.set(key, JSON.stringify(value));

							break;

						case 'boolean':
							if (value)
								url.searchParams.set(key, JSON.stringify(value));

							break;

						case 'number':
							url.searchParams.set(key, JSON.stringify(value));

							break;

						default:
							throw new Error(`Unsupported API parameter type: ${typeof value}`);
					}
				}
			} else
				request.body = JSON.stringify(parameters);
		}

		if (this.token !== null)
			headers.set('Authorization', `Bearer ${this.token.jwt}`);

		return fetch(url.href, request)
			.then(response => {
				if (response.headers.get('content-type') !== 'application/json') {
					const error = new Error(response.statusText);

					console.error(error);

					throw error;
				}

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

		if (token === null) {
			this.token = null;

			window.localStorage.removeItem(authTokenStorageKey);
		} else {
			this.token = new Token(token);

			if (!this.token.isValid()) {
				this.token = null;

				return;
			}

			const delay = this.token.body.exp - Math.floor(Date.now() / 1000) - 15;

			if (delay <= 5) {
				console.warn('There isn\'t enough time to refresh the token, forcing re-login');

				window.location.href = '/login';
			}

			window.localStorage.setItem(authTokenStorageKey, token);

			this.tokenRefreshId = window.setTimeout(() => {
				this.tokenRefreshId = null;

				this.refresh();
			}, delay * 1000);
		}
	}
}