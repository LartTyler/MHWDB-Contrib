import {Tuple} from '../../../Tuple';
import {WeaponType} from '../Weapon';

export enum AmmoType {
	NORMAL = 'normal',
	PIERCING = 'piercing',
	SPREAD = 'spread',
	STICKY = 'sticky',
	CLUSTER = 'cluster',
	RECOVER = 'recover',
	POISON = 'poison',
	PARALYSIS = 'paralysis',
	SLEEP = 'sleep',
	EXHAUST = 'exhaust',
	FLAMING = 'flaming',
	WATER = 'water',
	FREEZE = 'freeze',
	THUNDER = 'thunder',
	DRAGON = 'dragon',
	SLICING = 'slicing',
	WYVERN = 'wyvern',
	DEMON = 'demon',
	ARMOR = 'armor',
	TRANQ = 'tranq',
}

export interface IAmmoCapacity<TType extends AmmoType, TLength extends number> {
	capacities: Tuple<number, TLength>;
	type: TType;
}

export type NormalAmmoCapacity = Partial<IAmmoCapacity<AmmoType.NORMAL, 3>>;
export type PiercingAmmoCapacity = Partial<IAmmoCapacity<AmmoType.PIERCING, 3>>;
export type SpreadAmmoCapacity = Partial<IAmmoCapacity<AmmoType.SPREAD, 3>>;
export type StickyAmmoCapacity = Partial<IAmmoCapacity<AmmoType.STICKY, 3>>;
export type ClusterAmmoCapacity = Partial<IAmmoCapacity<AmmoType.CLUSTER, 3>>;
export type RecoverAmmoCapacity = Partial<IAmmoCapacity<AmmoType.RECOVER, 2>>;
export type PoisonAmmoCapacity = Partial<IAmmoCapacity<AmmoType.POISON, 2>>;
export type ParalysisAmmoCapacity = Partial<IAmmoCapacity<AmmoType.PARALYSIS, 2>>;
export type SleepAmmoCapacity = Partial<IAmmoCapacity<AmmoType.SLEEP, 2>>;
export type ExhaustAmmoCapacity = Partial<IAmmoCapacity<AmmoType.EXHAUST, 2>>;
export type FlamingAmmoCapacity = Partial<IAmmoCapacity<AmmoType.FLAMING, 1>>;
export type WaterAmmoCapacity = Partial<IAmmoCapacity<AmmoType.WATER, 1>>;
export type FreezeAmmoCapacity = Partial<IAmmoCapacity<AmmoType.FREEZE, 1>>;
export type ThunderAmmoCapacity = Partial<IAmmoCapacity<AmmoType.THUNDER, 1>>;
export type DragonAmmoCapacity = Partial<IAmmoCapacity<AmmoType.DRAGON, 1>>;
export type SlicingAmmoCapacity = Partial<IAmmoCapacity<AmmoType.SLICING, 1>>;
export type WyvernAmmoCapacity = Partial<IAmmoCapacity<AmmoType.WYVERN, 1>>;
export type DemonAmmoCapacity = Partial<IAmmoCapacity<AmmoType.DEMON, 1>>;
export type ArmorAmmoCapacity = Partial<IAmmoCapacity<AmmoType.ARMOR, 1>>;
export type TranqAmmoCapacity = Partial<IAmmoCapacity<AmmoType.TRANQ, 1>>;

export type AmmoCapacity = NormalAmmoCapacity | PiercingAmmoCapacity | SpreadAmmoCapacity | StickyAmmoCapacity
	| ClusterAmmoCapacity | RecoverAmmoCapacity | PoisonAmmoCapacity | ParalysisAmmoCapacity | SleepAmmoCapacity
	| ExhaustAmmoCapacity | FlamingAmmoCapacity | WaterAmmoCapacity | FreezeAmmoCapacity | ThunderAmmoCapacity
	| DragonAmmoCapacity | SlicingAmmoCapacity | WyvernAmmoCapacity | DemonAmmoCapacity | ArmorAmmoCapacity
	| TranqAmmoCapacity;

export interface IAmmoFunctionality {
	ammo: AmmoCapacity[];
}

export const isAmmoFunctionalityType = (type: WeaponType): boolean => {
	return type === WeaponType.LIGHT_BOWGUN || type === WeaponType.HEAVY_BOWGUN;
};

export const hasAmmoFunctionality = (value: any): value is IAmmoFunctionality => {
	return typeof value === 'object' && 'ammo' in value;
};
