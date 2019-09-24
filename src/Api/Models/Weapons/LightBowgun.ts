import {IWeapon, WeaponType} from '../Weapon';
import {IAmmoFunctionality} from './ammo';
import {IDeviationFunctionality} from './deviation';
import {ISpecialAmmoFunctionality} from './special-ammo';

interface ILightBowgunWeapon extends IWeapon<WeaponType.LIGHT_BOWGUN>,
	IAmmoFunctionality,
	IDeviationFunctionality,
	ISpecialAmmoFunctionality<WeaponType.LIGHT_BOWGUN> {
}

export type LightBowgunWeapon = Partial<ILightBowgunWeapon>;
