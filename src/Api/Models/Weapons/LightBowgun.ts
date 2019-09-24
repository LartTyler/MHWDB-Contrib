import {IWeapon, WeaponType} from '../Weapon';
import {IAmmoFunctionality} from './ammo';
import {IDeviationFunctionality} from './deviation';

interface ILightBowgunWeapon extends IWeapon<WeaponType.LIGHT_BOWGUN>, IAmmoFunctionality, IDeviationFunctionality {
}

export type LightBowgunWeapon = Partial<ILightBowgunWeapon>;
