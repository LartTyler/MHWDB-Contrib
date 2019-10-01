import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface ISwordAndShieldWeapon extends IWeapon<WeaponType.SWORD_AND_SHIELD>, IDurabilityFunctionality {
}

export type SwordAndShieldWeapon = Partial<ISwordAndShieldWeapon>;
