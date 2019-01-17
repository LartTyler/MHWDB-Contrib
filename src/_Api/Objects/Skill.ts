import {toValues} from '../../Utility/enum';
import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {
	generalAttributeNames,
	IGeneralAttributes,
	IResistanceAttributes,
	resistanceAttributeNames,
} from './attributes';
import {IEntity} from './Entity';

export enum SkillAttribute {
	AFFINITY = 'affinity',
	ATTACK = 'attack',
	DAMAGE_DRAGON = 'damageDragon',
	DAMAGE_FIRE = 'damageFire',
	DAMAGE_ICE = 'damageIce',
	DAMAGE_THUNDER = 'damageThunder',
	DAMAGE_WATER = 'damageWater',
	RESIST_ALL = 'resistAll',
	SHARPNESS_BONUS = 'sharpnessBonus',
}

export const skillAttributeNames = [
	...generalAttributeNames,
	...resistanceAttributeNames,
	...toValues<string>(SkillAttribute),
].sort();

export interface ISkillRankModifiers extends IGeneralAttributes, IResistanceAttributes {
	[key: string]: string | number;

	[SkillAttribute.ATTACK]?: number;
	[SkillAttribute.AFFINITY]?: number;
	[SkillAttribute.DAMAGE_DRAGON]?: string | number;
	[SkillAttribute.DAMAGE_FIRE]?: string | number;
	[SkillAttribute.DAMAGE_ICE]?: string | number;
	[SkillAttribute.DAMAGE_THUNDER]?: string | number;
	[SkillAttribute.DAMAGE_WATER]?: string | number;
	[SkillAttribute.RESIST_ALL]?: number;
	[SkillAttribute.RESIST_ALL]?: number;
	[SkillAttribute.SHARPNESS_BONUS]?: number;
}

export interface ISkillRank extends IEntity {
	skill?: number;
	skillName?: string;
	level?: number;
	description?: string;
	modifiers?: ISkillRankModifiers;
}

export interface ISkill extends IEntity {
	name?: string;
	description?: string;
	ranks?: ISkillRank[];
}

export class SkillApiClientModule extends AbstractApiClientModule<ISkill> {
	public constructor(client: ApiClient) {
		super(client, '/skills');
	}
}
