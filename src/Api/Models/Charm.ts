import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {Id, IEntity, ISimpleCraftingCost, ISimpleSkillRank} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {CraftingCost} from './Item';
import {SkillRank} from './Skill';

interface ICharm extends IEntity {
	name: string;
	ranks: CharmRank[];
}

interface ICharmRank {
	crafting: CharmRankCraftingInfo;
	level: number;
	name: string;
	rarity: number;
	skills: SkillRank[];
}

interface ICharmRankCraftingInfo {
	craftable: boolean;
	materials: CraftingCost[];
}

export type Charm = Partial<ICharm>;
export type CharmRank = Partial<ICharmRank>;
export type CharmRankCraftingInfo = Partial<ICharmRankCraftingInfo>;

type PayloadReadyCharmRank = Omit<CharmRank, 'crafting' | 'level' | 'skills'> & {
	crafting?: Omit<CharmRankCraftingInfo, 'materials'> & {
		materials?: ISimpleCraftingCost[];
	};
	level?: number;
	skills?: ISimpleSkillRank[];
};

export interface ICharmCreatePayload {
	name: string;
	ranks?: Array<Omit<PayloadReadyCharmRank, 'level'> & {
		level: number;
	}>;
}

export interface ICharmUpdatePayload {
	name?: string;
	ranks?: PayloadReadyCharmRank[];
}

export class CharmModel {
	public static list(query: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/charms', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: ICharmCreatePayload, projection?: Projection) {
		return client.put('/charms', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/charms/:id'>(`/charms/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: ICharmUpdatePayload, projection?: Projection) {
		return client.patch<'/charms/:id'>(`/charms/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/charms/:id'>(`/charms/${id}`);
	}
}
