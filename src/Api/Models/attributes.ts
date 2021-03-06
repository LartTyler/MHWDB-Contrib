export enum AttributeName {
	AFFINITY = 'affinity',
	DAMAGE_DRAGON = 'damageDragon',
	DAMAGE_FIRE = 'damageFire',
	DAMAGE_ICE = 'damageIce',
	DAMAGE_THUNDER = 'damageThunder',
	DAMAGE_WATER = 'damageWater',
	DEFENSE = 'defense',
	GENDER = 'requiredGender',
	HEALTH = 'health',
	RESIST_ALL = 'resistAll',
	RESIST_DRAGON = 'resistDragon',
	RESIST_FIRE = 'resistFire',
	RESIST_ICE = 'resistIce',
	RESIST_THUNDER = 'resistThunder',
	RESIST_WATER = 'resistWater',
	STAMINA = 'stamina',
}

export interface IAttribute {
	key: AttributeName;
	value: any;
}

export const attributeLabels = {
	[AttributeName.AFFINITY]: 'Affinity',
	[AttributeName.DAMAGE_DRAGON]: 'Damage / Dragon',
	[AttributeName.DAMAGE_FIRE]: 'Damage / Fire',
	[AttributeName.DAMAGE_ICE]: 'Damage / Ice',
	[AttributeName.DAMAGE_THUNDER]: 'Damage / Thunder',
	[AttributeName.DAMAGE_WATER]: 'Damage / Water',
	[AttributeName.DEFENSE]: 'Defense',
	[AttributeName.GENDER]: 'Required Gender',
	[AttributeName.HEALTH]: 'Health',
	[AttributeName.RESIST_ALL]: 'Resist / All',
	[AttributeName.RESIST_DRAGON]: 'Resist / Dragon',
	[AttributeName.RESIST_FIRE]: 'Resist / Fire',
	[AttributeName.RESIST_ICE]: 'Resist / Ice',
	[AttributeName.RESIST_THUNDER]: 'Resist / Thunder',
	[AttributeName.RESIST_WATER]: 'Resist / Water',
	[AttributeName.STAMINA]: 'Stamina',
};
