import {WeaponType} from '../Weapon';

export enum Deviation {
	NONE = 'none',
	LOW = 'low',
	AVERAGE = 'average',
	HIGH = 'high',
}

export interface IDeviationFunctionality {
	deviation: Deviation;
}

export const isDeviationFunctionalityType = (type: WeaponType) => {
	return type === WeaponType.LIGHT_BOWGUN || type === WeaponType.HEAVY_BOWGUN;
};

export const hasDeviationFunctionality = (value: any): value is IDeviationFunctionality => {
	return typeof value === 'object' && 'deviation' in value;
};
