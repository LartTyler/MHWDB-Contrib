import {Omit} from 'utility-types';
import {toValues} from '../../Utility/enum';
import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {IArmorSet} from './ArmorSet';
import {generalAttributeNames, IGeneralAttributes, IResistanceAttributes, resistanceAttributeNames} from './attributes';
import {ICraftingMaterialCost, IEntity, ISlot, Rank} from './Entity';
import {ISkill} from './Skill';

export enum Gender {
	FEMALE = 'female',
	MALE = 'male',
}

export enum ArmorAttribute {
	REQUIRED_GENDER = 'requiredGender',
}

export interface IArmorAttributes extends IGeneralAttributes, IResistanceAttributes {
	[ArmorAttribute.REQUIRED_GENDER]?: Gender;
}

export const armorAttributeNames = [
	...generalAttributeNames,
	...toValues<string>(ArmorAttribute),
].sort();

export const isGender = (value: any): value is Gender => {
	return value === 'male' || value === 'female';
};

export enum ArmorType {
	HEAD = 'head',
	CHEST = 'chest',
	GLOVES = 'gloves',
	WAIST = 'waist',
	LEGS = 'legs',
}

// @ts-ignore
export const armorTypeNames = Object.keys(ArmorType).map(key => ArmorType[key]);

export interface IArmorDefense {
	base?: number;
	max?: number;
	augmented?: number;
}

export interface IArmorResistances {
	fire?: number;
	water?: number;
	ice?: number;
	thunder?: number;
	dragon?: number;
}

export interface IArmorAssets {
	imageMale?: string;
	imageFemale?: string;
}

export interface IArmorCrafting {
	materials?: ICraftingMaterialCost[];
}

export interface IArmor extends IEntity {
	attributes?: IArmorAttributes;
	armorSet?: Omit<IArmorSet, 'pieces'> & {
		pieces?: number[];
	};
	assets?: IArmorAssets;
	crafting?: IArmorCrafting;
	defense?: IArmorDefense;
	name?: string;
	rank?: Rank;
	rarity?: number;
	resistances?: IArmorResistances;
	skills?: ISkill[];
	slots?: ISlot[];
	type?: ArmorType;
}

export class ArmorApiClientModule extends AbstractApiClientModule<IArmor> {
	public constructor(client: ApiClient) {
		super(client, '/armor');
	}
}
