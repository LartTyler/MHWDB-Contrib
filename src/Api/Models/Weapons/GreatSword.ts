import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface IGreatSwordWeapon extends IWeapon<WeaponType.GREAT_SWORD>, IDurabilityFunctionality {
}

export type GreatSwordWeapon = Partial<IGreatSwordWeapon>;
