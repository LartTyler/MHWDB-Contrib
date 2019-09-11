import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface IGunlanceWeapon extends IWeapon<WeaponType.GUNLANCE>, IDurabilityFunctionality {
}

export type GunlanceWeapon = Partial<IGunlanceWeapon>;
