import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface ILongSwordWeapon extends IWeapon<WeaponType.LONG_SWORD>, IDurabilityFunctionality {
}

export type LongSwordWeapon = Partial<ILongSwordWeapon>;
