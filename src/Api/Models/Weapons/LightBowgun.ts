import {IWeapon, WeaponType} from '../Weapon';
import {IAmmoFunctionality} from './ammo';

interface ILightBowgunWeapon extends IWeapon<WeaponType.LIGHT_BOWGUN>, IAmmoFunctionality {
}

export type LightBowgunWeapon = Partial<ILightBowgunWeapon>;
