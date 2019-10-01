import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';
import {IPhialFunctionality} from './phial';

interface IChargeBladeWeapon extends IWeapon<WeaponType.CHARGE_BLADE>, IPhialFunctionality, IDurabilityFunctionality {
}

export type ChargeBladeWeapon = Partial<IChargeBladeWeapon>;
