import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

export enum ShellingType {
	LONG = 'long',
	NORMAL = 'normal',
	WIDE = 'wide',
}

export interface IShellingInfo {
	level: number;
	type: ShellingType;
}

interface IGunlanceWeapon extends IWeapon<WeaponType.GUNLANCE>, IDurabilityFunctionality {
	shelling: IShellingInfo;
}

export type GunlanceWeapon = Partial<IGunlanceWeapon>;
