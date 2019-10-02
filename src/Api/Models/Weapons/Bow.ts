import {IWeapon, WeaponType} from '../Weapon';

export enum BowCoating {
	BLAST = 'blast',
	CLOSE_RANGE = 'close range',
	PARALYSIS = 'paralysis',
	POISON = 'poison',
	POWER = 'power',
	SLEEP = 'sleep',
}

export interface IBowCoatingFunctionality {
	coatings: BowCoating[];
}

interface IBowWeapon extends IWeapon<WeaponType.BOW>, IBowCoatingFunctionality {
}

export type BowWeapon = Partial<IBowWeapon>;

export const isBowCoatingFunctionalityType = (type: WeaponType): boolean => type === WeaponType.BOW;

export const hasBowCoatingFunctionality = (value: any): value is IBowCoatingFunctionality => {
	return typeof value === 'object' && 'coatings' in value;
};
