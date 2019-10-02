import {IWeapon, WeaponType} from '../Weapon';
import {IAmmoFunctionality} from './ammo';
import {IDeviationFunctionality} from './deviation';
import {ISpecialAmmoFunctionality} from './special-ammo';

interface IHeavyBowgunWeapon extends IWeapon<WeaponType.HEAVY_BOWGUN>,
	IAmmoFunctionality,
	IDeviationFunctionality,
	ISpecialAmmoFunctionality<WeaponType.HEAVY_BOWGUN> {
}

export type HeavyBowgunWeapon = Partial<IHeavyBowgunWeapon>;
