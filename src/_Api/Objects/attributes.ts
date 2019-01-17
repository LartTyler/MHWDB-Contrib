import {toValues} from '../../Utility/enum';

export enum GeneralAttribute {
	DEFENSE = 'defense',
	HEALTH = 'health',
	STAMINA = 'stamina',
}

export const generalAttributeNames = toValues<string>(GeneralAttribute).sort();

export interface IGeneralAttributes {
	[key: string]: string | number;

	[GeneralAttribute.DEFENSE]?: number;
	[GeneralAttribute.HEALTH]?: number;
	[GeneralAttribute.STAMINA]?: number;
}

export enum ResistanceAttribute {
	RESIST_DRAGON = 'resistDragon',
	RESIST_FIRE = 'resistFire',
	RESIST_ICE = 'resistIce',
	RESIST_THUNDER = 'resistThunder',
	RESIST_WATER = 'resistWater',
}

export const resistanceAttributeNames = toValues<string>(ResistanceAttribute).sort();

export interface IResistanceAttributes {
	[key: string]: string | number;

	[ResistanceAttribute.RESIST_DRAGON]?: number;
	[ResistanceAttribute.RESIST_FIRE]?: number;
	[ResistanceAttribute.RESIST_ICE]?: number;
	[ResistanceAttribute.RESIST_THUNDER]?: number;
	[ResistanceAttribute.RESIST_WATER]?: number;
}

export const getDisplayName = (attribute: string): string => {
	let output = '';

	for (let i = 0; i < attribute.length; i++) {
		const char = attribute.charAt(i);

		if (i === 0)
			output += char.toUpperCase();
		else if (char === char.toUpperCase())
			output += ` ${char}`;
		else
			output += char;
	}

	return output;
};
