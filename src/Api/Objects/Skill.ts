import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {GeneralAttribute, GeneralAttributes, ResistanceAttribute, ResistanceAttributes} from './attributes';
import {IEntity} from './Entity';

export const SkillAttribute = {
	...GeneralAttribute,
	...ResistanceAttribute,

	ATTACK: 'attack' as 'attack',
	AFFINITY: 'affinity' as 'affinity',
	DAMAGE_DRAGON: 'damageDragon' as 'damageDragon',
	DAMAGE_FIRE: 'damageFire' as 'damageFire',
	DAMAGE_ICE: 'damageIce' as 'damageIce',
	DAMAGE_THUNDER: 'damageThunder' as 'damageThunder',
	DAMAGE_WATER: 'damageWater' as 'damageWater',
	RESIST_ALL: 'resistAll' as 'resistAll',
	SHARPNESS_BONUS: 'sharpnessBonus' as 'sharpnessBonus',
};

export interface ISkillRankModifiers extends GeneralAttributes, ResistanceAttributes {
	[SkillAttribute.ATTACK]?: number;
	[SkillAttribute.AFFINITY]?: number;
	[SkillAttribute.DAMAGE_DRAGON]?: string | number;
	[SkillAttribute.DAMAGE_FIRE]?: string | number;
	[SkillAttribute.DAMAGE_ICE]?: string | number;
	[SkillAttribute.DAMAGE_THUNDER]?: string | number;
	[SkillAttribute.DAMAGE_WATER]?: string | number;
	[SkillAttribute.RESIST_ALL]?: number;
	[SkillAttribute.RESIST_ALL]?: number;
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
