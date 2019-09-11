import {IWeapon, WeaponType} from '../Weapon';
import {IAmmoFunctionality} from './ammo';

interface IHeavyBowgunWeapon extends IWeapon<WeaponType.HEAVY_BOWGUN>, IAmmoFunctionality {
}

export type HeavyBowgunWeapon = Partial<IHeavyBowgunWeapon>;
