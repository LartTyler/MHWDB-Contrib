export interface IEntity {
	id: number;
}

export type Entity = Partial<IEntity>;

export type Id = string | number;

export enum Rank {
	HIGH = 'high',
	LOW = 'low',
	MASTER = 'master',
}

export const orderedRanks = [
	Rank.LOW,
	Rank.HIGH,
	Rank.MASTER,
];

interface ISlot {
	rank: number;
}

export type Slot = Partial<ISlot>;

export interface ISimpleSkillRank {
	level: number;
	skill: number;
}

export interface ISimpleCraftingCost {
	quantity: number;
	item: number;
}

export enum Attribute {
	AFFINITY = 'affinity',
	ATTACK = 'attack',
	DAMAGE_DRAGON = 'damageDragon',
	DAMAGE_FIRE = 'damageFire',
	DAMAGE_ICE = 'damageIce',
	DAMAGE_THUNDER = 'damageThunder',
	DAMAGE_WATER = 'damageWater',
	SHARPNESS_BONUS = 'sharpnessBonus',
	RESIST_ALL = 'resistAll',
	RESIST_DRAGON = 'resistDragon',
	RESIST_FIRE = 'resistFire',
	RESIST_ICE = 'resistIce',
	RESIST_THUNDER = 'resistThunder',
	RESIST_WATER = 'resistWater',
}

export interface IAttributes {
	[key: string]: any;

	affinity?: string;
	attack?: number;
	damageDragon?: number;
	damageFire?: number;
	damageIce?: number;
	damageThunder?: number;
	damageWater?: number;
	defense?: number;
	health?: number;
	sharpnessBonus?: number;
	resistAll?: number;
	resistDragon?: number;
	resistFire?: number;
	resistIce?: number;
	resistThunder?: number;
	resistWater?: number;
}

// @ts-ignore
export const attributeNames = Object.keys(Attribute).map(key => Attribute[key]);

export const getAttributeDisplayName = (key: string): string => {
	let output = '';

	for (let i = 0; i < key.length; i++) {
		const char = key.charAt(i);

		if (i === 0)
			output += char.toUpperCase();
		else if (char === char.toUpperCase())
			output += ` ${char}`;
		else
			output += char;
	}

	return output;
};
