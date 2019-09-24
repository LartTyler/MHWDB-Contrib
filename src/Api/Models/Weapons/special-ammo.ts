import {WeaponType} from '../Weapon';

export enum LightBowgunSpecialAmmo {
	WYVERNBLAST = 'wyvernblast',
}

export enum HeavyBowgunSpecialAmmo {
	WYVERNHEART = 'wyvernheart',
	WYVERNSNIPE = 'wyvernsnipe',
}

type BowgunWeaponType = WeaponType.LIGHT_BOWGUN | WeaponType.HEAVY_BOWGUN;

export interface ISpecialAmmoFunctionality<T extends BowgunWeaponType = BowgunWeaponType> {
	type: T;
	specialAmmo: T extends WeaponType.LIGHT_BOWGUN ? LightBowgunSpecialAmmo : HeavyBowgunSpecialAmmo;
}

export const isSpecialAmmoFunctionalityType = (type: WeaponType) => {
	return type === WeaponType.LIGHT_BOWGUN || type === WeaponType.HEAVY_BOWGUN;
};

export const hasSpecialAmmoFunctionality = (value: any): value is ISpecialAmmoFunctionality => {
	return typeof value === 'object' && 'specialAmmo' in value;
};
