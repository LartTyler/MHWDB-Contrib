export interface IEntity {
	id: number;
}

export type Entity = Partial<IEntity>;

export type Id = string | number;

export enum Rank {
	HIGH = 'high',
	LOW = 'low',
}

// @ts-ignore
export const rankNames = Object.keys(Rank).map(key => Rank[key]);

interface ISlot {
	rank: number;
}

export type Slot = Partial<ISlot>;

export interface IAttributes {
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
