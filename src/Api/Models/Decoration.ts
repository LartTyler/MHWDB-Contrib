import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {Id, IEntity, ISimpleSkillRank} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {SkillRank} from './Skill';

interface IDecoration extends IEntity {
	name: string;
	rarity: number;
	skills: SkillRank[];
	slot: number;
}

export type Decoration = Partial<IDecoration>;

export interface IDecorationCreatePayload {
	name: string;
	rarity: number;
	skills?: ISimpleSkillRank[];
	slot: number;
}

export type DecorationUpdatePayload = Omit<Decoration, 'id' | 'skills'> & {
	skills?: ISimpleSkillRank[];
};

export type DecorationPayload = IDecorationCreatePayload | DecorationUpdatePayload;

export class DecorationModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/decorations', {
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: IDecorationCreatePayload, projection?: Projection) {
		return client.put('/decorations', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/decorations/:id'>(`/decorations/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: DecorationUpdatePayload, projection?: Projection) {
		return client.patch<'/decorations/:id'>(`/decorations/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/decorations/:id'>(`/decorations/${id}`);
	}
}
