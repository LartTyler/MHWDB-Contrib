import {history} from '../../history';
import {client} from '../client';
import {Token} from './Token';

export class TokenStore {
	protected storageKey: string = null;
	protected token: Token = null;
	protected refreshTaskId: number = null;

	public constructor(storageKey: string = null) {
		this.storageKey = storageKey;
	}

	public initialize(): void {
		const jwt = this.getStoredToken();
		let token: Token = null;

		if (jwt) {
			token = new Token(jwt);

			if (token.isValid())
				this.setToken(token);
		}
	}

	public isAuthenticated(): boolean {
		return this.getToken() && this.getToken().isValid();
	}

	public getToken(): Token {
		return this.token;
	}

	public setToken(token: Token): this {
		this.token = token;

		if (token) {
			if (token.getTimeToLive() <= 5)
				this.token = null;
			else {
				client.defaults.headers.authorization = `Bearer ${token.jwt}`;

				this.setStoredToken(token.jwt);
			}
		}

		if (this.token === null) {
			this.setStoredToken(null);
			this.clearRefreshTask();

			delete client.defaults.headers.authorization;

			if (history.location.pathname !== '/login')
				history.push('/login');
		} else
			this.scheduleRefresh();

		return this;
	}

	protected getStoredToken(): string {
		if (!this.storageKey)
			return null;

		return window.localStorage.getItem(this.storageKey);
	}

	protected setStoredToken(jwt: string): void {
		if (!this.storageKey)
			return;

		if (jwt !== null)
			window.localStorage.setItem(this.storageKey, jwt);
		else
			window.localStorage.removeItem(this.storageKey);
	}

	protected scheduleRefresh(): void {
		if (this.getToken() === null)
			throw new Error('Cannot schedule refresh without a token');

		this.clearRefreshTask();

		window.setTimeout(() => {
			client.get('/auth/refresh')
				.then(response => this.setToken(new Token(response.data.token)));
		}, Math.max((this.getToken().getTimeToLive() - 5) * 1000, 1));
	}

	protected clearRefreshTask(): void {
		if (this.refreshTaskId === null)
			return;

		window.clearTimeout(this.refreshTaskId);

		this.refreshTaskId = null;
	}
}
