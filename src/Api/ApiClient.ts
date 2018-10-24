import {ApiError} from './Errors/ApiError';
import {AilmentApiClientModule} from './Objects/Ailment';
import {IEntity} from './Objects/Entity';
import {ItemApiClientModule} from './Objects/Item';
import {Projection} from './Projection';
import {IQueryDocument} from './Query';
import {isAuthResponse, isErrorResponse, isObjectArrayResponse, isObjectResponse} from './Response';
import {Token} from './Token';

interface IRequestParams {
	[key: string]: string | number | boolean | null | object;
}

const TOKEN_STORAGE_KEY = 'api.auth_token';

export class ApiClient {
	public readonly ailments: AilmentApiClientModule;
	public readonly items: ItemApiClientModule;

	protected baseUrl: string;

	protected token: Token = null;
	protected tokenRefreshId: number = null;

	public constructor(baseUrl: string) {
		this.baseUrl = baseUrl;

		this.ailments = new AilmentApiClientModule(this);
		this.items = new ItemApiClientModule(this);

		const jwt = window.localStorage.getItem(TOKEN_STORAGE_KEY);

		if (jwt)
			this.setToken(jwt);
	}

	public getToken(): Token {
		return this.token;
	}

	public isAuthenticated(): boolean {
		return this.token && this.token.isValid();
	}

	public login(username: string, password: string): Promise<void> {
		return this.fetch('POST', '/auth', {}, {
			password,
			username,
		}).then(response => {
			if (!isAuthResponse(response)) {
				throw new Error('Invalid response from API');
			}

			this.setToken(response.token);
		});
	}

	public refresh(): Promise<void> {
		return this.fetch('GET', '/auth/refresh').then(response => {
			if (!isAuthResponse(response)) {
				throw new Error('Invalid response from API');
			}

			this.setToken(response.token);
		});
	}

	public logout(): void {
		this.setToken(null);
	}

	public list(
		path: string,
		query?: IQueryDocument,
		projection?: Projection,
		signal?: AbortSignal,
	): Promise<object[]> {
		const params: IRequestParams = {};

		if (query) {
			params.q = query;
		}

		if (projection) {
			params.p = projection;
		}

		return this.fetch('GET', path, params, undefined, signal).then(response => {
			if (!isObjectArrayResponse(response)) {
				throw new Error('Unexpected response type from API');
			}

			return response;
		});
	}

	public read(path: string, projection?: Projection, signal?: AbortSignal): Promise<object> {
		const params: IRequestParams = {};

		if (projection) {
			params.p = projection;
		}

		return this.fetch('GET', path, params, undefined, signal).then(response => {
			if (!isObjectResponse(response))
				throw new Error('Unexpected response from API');

			return response;
		});
	}

	public update<T extends IEntity>(path: string, values: T, projection?: Projection): Promise<object> {
		const params: IRequestParams = {};

		if (projection) {
			params.p = projection;
		}

		return this.fetch('PATCH', path, params, values).then(response => {
			if (!isObjectResponse(response)) {
				throw new Error('Unexpected response from API');
			}

			return response;
		});
	}

	public delete(path: string): Promise<void> {
		return this.fetch('DELETE', path).then(() => {
			return;
		});
	}

	protected fetch(
		method: string,
		path: string,
		queryParameters?: IRequestParams,
		body?: string | object,
		signal?: AbortSignal,
	): Promise<unknown> {
		if (path.charAt(0) === '/')
			path = path.substr(1);

		const url = new URL(path, this.baseUrl);
		const headers = new Headers({
			'Content-Type': 'application/json',
		});

		const request: RequestInit = {
			headers,
			method: method.toUpperCase(),
		};

		if (queryParameters) {
			for (const key in queryParameters) {
				if (!queryParameters.hasOwnProperty(key))
					continue;

				const value = queryParameters[key];

				switch (typeof value) {
					case 'object':
						url.searchParams.set(key, JSON.stringify(value));

						break;

					case 'boolean':
						if (value) {
							url.searchParams.set(key, '');
						}

						break;

					case 'number':
						url.searchParams.set(key, value.toString());

						break;
				}
			}
		}

		if (body) {
			if (request.method === 'GET')
				throw new Error('Cannot set body parameters for GET requests');

			request.body = JSON.stringify(body);
		}

		if (this.token !== null)
			headers.set('Authorization', `Bearer ${this.token.jwt}`);

		if (signal)
			request.signal = signal;

		return fetch(url.href, request)
			.then(response => {
				if (response.headers.get('content-type') === 'application/json') {
					return response.json();
				} else if (response.status === 204) {
					return null;
				}

				throw new Error('API did not send a JSON response');
			})
			.then(response => {
				if (isErrorResponse(response)) {
					throw new ApiError(response.error.code, response.error.message);
				}

				return response;
			});
	}

	protected setToken(jwt: string): void {
		if (this.tokenRefreshId !== null) {
			window.clearTimeout(this.tokenRefreshId);

			this.tokenRefreshId = null;
		}

		if (jwt === null) {
			this.token = null;

			window.localStorage.removeItem(TOKEN_STORAGE_KEY);
		} else {
			this.token = new Token(jwt);

			if (!this.token.isValid()) {
				this.token = null;

				window.localStorage.removeItem(TOKEN_STORAGE_KEY);

				return;
			}

			const delay = this.token.getTimeToLive() - 15;

			if (delay <= 5) {
				window.localStorage.removeItem(TOKEN_STORAGE_KEY);

				window.location.href = '/login';
			}

			window.localStorage.setItem(TOKEN_STORAGE_KEY, jwt);

			this.tokenRefreshId = window.setTimeout(() => {
				this.tokenRefreshId = null;

				this.refresh();
			}, delay * 1000);
		}
	}
}
