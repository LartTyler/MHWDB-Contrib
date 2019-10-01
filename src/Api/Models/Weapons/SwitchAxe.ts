import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';
import {IPhialFunctionality} from './phial';

interface ISwitchAxe extends IWeapon<WeaponType.SWITCH_AXE>, IPhialFunctionality, IDurabilityFunctionality {
}

export type SwitchAxeWeapon = Partial<ISwitchAxe>;
