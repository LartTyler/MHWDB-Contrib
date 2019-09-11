import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface IInsectGlaiveWeapon extends IWeapon<WeaponType.INSECT_GLAIVE>, IDurabilityFunctionality {
}

export type InsectGlaiveWeapon = Partial<IInsectGlaiveWeapon>;
