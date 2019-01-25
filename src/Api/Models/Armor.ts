import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {Id, IEntity, Rank, Slot} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {ArmorSet} from './ArmorSet';
import {CraftingCost} from './Item';
import {SkillRank} from './Skill';

export enum ArmorType {
	CHEST = 'chest',
	GLOVES = 'gloves',
	HEAD = 'head',
	LEGS = 'legs',
	WAIST = 'waist',
}

export enum Gender {
	MALE = 'male',
	FEMALE = 'female',
}

// @ts-ignore
export const armorTypeNames = Object.keys(ArmorType).map(key => ArmorType[key]);

interface IArmor extends IEntity {
	armorSet: Omit<ArmorSet, 'pieces'> & {
		pieces?: number[];
	};
	assets: ArmorAssets;
	attributes: IArmorAttributes;
	crafting: ArmorCraftingInfo;
	defense: Defense;
	name: string;
	rank: Rank;
	rarity: number;
	resistances: Resistances;
	skills: SkillRank[];
	slots: Slot[];
	type: ArmorType;
}

interface IDefense {
	augmented: number;
	base: number;
	max: number;
}

interface IResistances {
	dragon: number;
	fire: number;
	ice: number;
	thunder: number;
	water: number;
}

interface IArmorAssets {
	imageMale: string;
	imageFemale: string;
}

interface IArmorCraftingInfo {
	materials: CraftingCost[];
}

export enum ArmorAttribute {
	REQUIRED_GENDER = 'requiredGender',
}

export interface IArmorAttributes {
	requiredGender?: Gender;
}

// @ts-ignore
export const armorAttributeNames = Object.keys(ArmorAttribute).map(key => ArmorAttribute[key]);

export const isGender = (value: any): value is Gender => {
	return value === Gender.MALE || value === Gender.FEMALE;
};

export type Defense = Partial<IDefense>;
export type Resistances = Partial<IResistances>;
export type ArmorAssets = Partial<IArmorAssets>;
export type ArmorCraftingInfo = Partial<IArmorCraftingInfo>;
export type Armor = Partial<IArmor>;

export type ArmorPayload = Omit<Armor, 'armorSet' | 'assets' | 'crafting' | 'skills'> & {
	armorSet?: number;
	crafting?: {
		materials: Array<{
			quantity: number;
			item: number;
		}>;
	};
	skills?: Array<{
		skill: number;
		level: number;
	}>;
};

export class ArmorModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/armor', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: ArmorPayload, projection?: Projection) {
		return client.put('/armor', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/armor/:id'>(`/armor/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: ArmorPayload, projection?: Projection) {
		return client.patch<'/armor/:id'>(`/armor/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/armor/:id'>(`/armor/${id}`);
	}
}
