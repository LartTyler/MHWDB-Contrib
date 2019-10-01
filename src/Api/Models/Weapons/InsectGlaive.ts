import {IDurabilityFunctionality, IWeapon, WeaponType} from '../Weapon';

export enum InsectGlaiveBoostType {
	BLUNT = 'blunt',
	ELEMENT = 'element',
	HEALTH = 'health',
	SEVER = 'sever',
	SPEED = 'speed',
	STAMINA = 'stamina',
}

interface IInsectGlaiveWeapon extends IWeapon<WeaponType.INSECT_GLAIVE>, IDurabilityFunctionality {
	boostType: InsectGlaiveBoostType;
}

export type InsectGlaiveWeapon = Partial<IInsectGlaiveWeapon>;
