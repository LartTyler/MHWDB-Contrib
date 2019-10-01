import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface IDualBladesWeapon extends IWeapon<WeaponType.DUAL_BLADES>, IDurabilityFunctionality {
}

export type DualBladesWeapon = Partial<IDualBladesWeapon>;
