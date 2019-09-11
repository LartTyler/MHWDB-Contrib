import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

interface IHuntingHornWeapon extends IWeapon<WeaponType.HUNTING_HORN>, IDurabilityFunctionality {
}

export type HuntingHornWeapon = Partial<IHuntingHornWeapon>;
