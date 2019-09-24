import {IWeapon, WeaponType} from '../Weapon';
import {IAmmoFunctionality} from './ammo';
import {IDeviationFunctionality} from './deviation';

interface IHeavyBowgunWeapon extends IWeapon<WeaponType.HEAVY_BOWGUN>, IAmmoFunctionality, IDeviationFunctionality {
}

export type HeavyBowgunWeapon = Partial<IHeavyBowgunWeapon>;
