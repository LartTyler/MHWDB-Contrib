import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {Role} from '../../Components/RequireRole';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';

interface IUser extends IEntity {
	createdDate: Date;
	disabled: boolean;
	displayName: string;
	email: string;
	roles: Role[];
}

export type User = Partial<IUser>;
export type UserPayload = Omit<User, 'id' | 'createdDate'>;

export type UserCreatePayload = UserPayload & {
	activationUrl: string;
};

export interface IUserPasswordPayload {
	password: string;
}

export class UserModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/users', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: UserCreatePayload, projection?: Projection) {
		return client.put('/users', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/users/:id'>(`/users/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, payload: UserPayload, projection?: Projection) {
		return client.patch<'/users/:id'>(`/users/${id}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/users/:id'>(`/users/${id}`);
	}

	public static activate(code: string, password: string) {
		return client.post<'/users/activate/:code'>(`/users/activate/${code}`, {
			password,
		});
	}

	public static sendPasswordResetCode(email: string) {
		return client.post('/users/password-reset', {
			email,
			passwordResetUrl: `${window.location.protocol}//${window.location.host}/password-reset/:code`,
		});
	}

	public static resetPassword(code: string, password: string) {
		return client.post<'/users/password-reset/:code'>(`/users/password-reset/${code}`, {
			password,
		});
	}
}
