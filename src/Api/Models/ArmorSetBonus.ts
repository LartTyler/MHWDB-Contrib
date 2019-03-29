import {CancelToken} from 'axios';
import {client} from '../client';
import {Id, IEntity, ISimpleSkillRank} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {SkillRank} from './Skill';

interface IArmorSetBonus extends IEntity {
	name: string;
	ranks: ArmorSetBonusRank[];
}

interface IArmorSetBonusRank {
	pieces: number;
	skill: SkillRank;
}

export type ArmorSetBonus = Partial<IArmorSetBonus>;
export type ArmorSetBonusRank = Partial<IArmorSetBonusRank>;

export interface IArmorSetBonusCreatePayload {
	name: string;
	ranks: Array<{
		pieces: number;
		skill: ISimpleSkillRank;
	}>;
}

export interface IArmorSetBonusUpdatePayload {
	name?: string;
	ranks?: Array<{
		pieces: number;
		skill: ISimpleSkillRank;
	}>;
}

export class ArmorSetBonusModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/armor/sets/bonuses', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: IArmorSetBonusCreatePayload, projection?: Projection) {
		return client.put('/armor/sets/bonuses', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/armor/sets/bonuses/:id'>(`/armor/sets/bonuses/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, payload: IArmorSetBonusUpdatePayload, projection?: Projection) {
		return client.patch<'/armor/sets/bonuses/:id'>(`/armor/sets/bonuses/${id}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/armor/sets/bonuses/:id'>(`/armor/sets/bonuses/${id}`);
	}
}
