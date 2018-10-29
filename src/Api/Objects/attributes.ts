export const GeneralAttribute = {
	DEFENSE: 'defense' as 'defense',
	HEALTH: 'health' as 'health',
	STAMINA: 'stamina' as 'stamina',
};

export interface GeneralAttributes {
	[GeneralAttribute.DEFENSE]?: number;
	[GeneralAttribute.HEALTH]?: number;
	[GeneralAttribute.STAMINA]?: number;
}

export const ResistanceAttribute = {
	RESIST_DRAGON: 'resistDragon' as 'resistDragon',
	RESIST_FIRE: 'resistFire' as 'resistFire',
	RESIST_ICE: 'resistIce' as 'resistIce',
	RESIST_THUNDER: 'resistThunder' as 'resistThunder',
	RESIST_WATER: 'resistWater' as 'resistWater',
};

export interface ResistanceAttributes {
	[ResistanceAttribute.RESIST_DRAGON]?: number | string;
	[ResistanceAttribute.RESIST_FIRE]?: number | string;
	[ResistanceAttribute.RESIST_ICE]?: number | string;
	[ResistanceAttribute.RESIST_WATER]?: number | string;
}

export const getDisplayName = (key: string): string => {
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
