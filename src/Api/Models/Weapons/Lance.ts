import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface ILanceWeapon extends IWeapon<WeaponType.LANCE>, IDurabilityFunctionality {
}

export type LanceWeapon = Partial<ILanceWeapon>;
