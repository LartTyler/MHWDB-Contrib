import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface IHammerWeapon extends IWeapon<WeaponType.HAMMER>, IDurabilityFunctionality {
}

export type HammerWeapon = Partial<IHammerWeapon>;
