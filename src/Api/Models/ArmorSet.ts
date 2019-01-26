import {CancelToken} from 'axios';
import {client} from '../client';
import {Id, IEntity, Rank} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {Armor} from './Armor';
import {SkillRank} from './Skill';

interface IArmorSet extends IEntity {
	bonus: ArmorSetBonus;
	name: string;
	pieces: Armor[];
	rank: Rank;
}

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
export type ArmorSet = Partial<IArmorSet>;

export interface IArmorSetCreatePayload {
	name: string;

	bonus?: number;
	pieces?: number[];
	rank?: Rank;
}

export interface IArmorSetUpdatePayload {
	bonus?: number;
	name?: number;
	pieces?: number[];
	rank?: Rank;
}

export class ArmorSetModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/armor/sets', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: IArmorSetCreatePayload, projection?: Projection) {
		return client.put('/armor/sets', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/armor/sets/:id'>(`/armor/sets/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: IArmorSetUpdatePayload, projection?: Projection) {
		return client.patch<'/armor/sets/:id'>(`/armor/sets/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/armor/sets/:id'>(`/armor/sets/${id}`);
	}
}
