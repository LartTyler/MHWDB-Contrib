import {WeaponType} from '../Weapon';

export enum PhialType {
	ELEMENT = 'element',
	IMPACT = 'impact',
	POWER = 'power',
	POWER_ELEMENT = 'power element',
}

export enum DamagePhialType {
	DRAGON = 'dragon',
	EXHAUST = 'exhaust',
	PARA = 'para',
	POISON = 'poison',
}

interface IPhialInfo {
	type: PhialTypes;
	damage: number;
}

export type PhialTypes = PhialType | DamagePhialType;
export type PhialInfo = Partial<IPhialInfo>;

export interface IPhialFunctionality {
	phial: PhialInfo;
}

export const hasPhialFunctionality = (value: any): value is IPhialFunctionality => {
	return typeof value === 'object' && 'phial' in value;
};

export const isPhialFunctionalityType = (type: WeaponType): boolean => {
	return type === WeaponType.CHARGE_BLADE || type === WeaponType.SWITCH_AXE;
};
