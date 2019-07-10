import {CancelToken} from 'axios';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {Item} from './Item';
import {Skill} from './Skill';

export enum RecoveryAction {
	CROUCH = 'crouch',
	DODGE = 'dodge',
	HIT = 'hit',
}

interface IAilment extends IEntity {
	name: string;
	description: string;
	protection: AilmentProtection;
	recovery: AilmentRecovery;
}

interface IAilmentProtection {
	items: Item[];
	skills: Array<Pick<Skill, 'id' | 'name' | 'description'>>;
}

interface IAilmentRecovery {
	actions: RecoveryAction[];
	items: Item[];
}

export type AilmentProtection = Partial<IAilmentProtection>;
export type AilmentRecovery = Partial<IAilmentRecovery>;
export type Ailment = Partial<IAilment>;

export interface IAilmentPayload {
	name: string;
	description: string;
	protection?: {
		items?: number[];
		skills?: number[];
	};
	recovery?: {
		actions?: string[];
		items?: number[];
	};
}

export class AilmentModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/ailments', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: IAilmentPayload, projection?: Projection) {
		return client.put('/ailments', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/ailments/:id'>(`/ailments/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: IAilmentPayload, projection?: Projection) {
		return client.patch<'/ailments/:id'>(`/ailments/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/ailments/:id'>(`/ailments/${id}`);
	}
}
