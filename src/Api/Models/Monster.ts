import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {Ailment} from './Ailment';
import {Item} from './Item';
import {Location} from './Location';
import {RewardCondition, RewardConditionPayload} from './Reward';
import {Element} from './Weapon';

export enum MonsterType {
	SMALL = 'small',
	LARGE = 'large',
}

export enum MonsterSpecies {
	BIRD_WYVERN = 'bird wyvern',
	BRUTE_WYVERN = 'brute wyvern',
	FANGED_WYVERN = 'fanged wyvern',
	FISH = 'fish',
	FLYING_WYVERN = 'flying wyvern',
	HERBIVORE = 'herbivore',
	LYNIAN = 'lynian',
	NEOPTERON = 'neopteron',
	PISCINE_WYVERN = 'piscine wyvern',
	WINGDRAKE = 'wingdrake',
	ELDER_DRAGON = 'elder dragon',
}

interface IMonster extends IEntity {
	ailments: Ailment[];
	description: string;
	elements: Element[];
	locations: Location[];
	name: string;
	resistances: MonsterResistance[];
	rewards: MonsterReward[];
	species: MonsterSpecies;
	type: MonsterType;
	weaknesses: MonsterWeakness[];
}

interface IMonsterResistance {
	element: Element;
	condition: string;
}

interface IMonsterWeakness {
	condition: string;
	element: Element;
	stars: number;
}

interface IMonsterReward extends IEntity {
	conditions: RewardCondition[];
	item: Item;
}

export type MonsterResistance = Partial<IMonsterResistance>;
export type MonsterWeakness = Partial<IMonsterWeakness>;
export type MonsterReward = Partial<IMonsterReward>;
export type Monster = Partial<IMonster>;

export type MonsterPayload = Omit<Monster, 'ailments' | 'locations' | 'rewards'> & {
	ailments?: number[];
	locations?: number[];
	rewards?: {
		conditions: RewardConditionPayload;
		item: number;
	};
};

export class MonsterModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/monsters', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(payload: MonsterPayload, projection?: Projection) {
		return client.put('/monsters', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/monsters/:id'>(`/monsters/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, payload: MonsterPayload, projection?: Projection) {
		return client.patch<'/monsters/:id'>(`/monsters/${id}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/monsters/:id'>(`/monsters/${id}`);
	}
}
