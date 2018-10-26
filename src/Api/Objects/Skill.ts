import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {GeneralAttributes, ResistanceAttributes} from './attributes';
import {IEntity} from './Entity';

export interface ISkillRankModifiers extends GeneralAttributes, ResistanceAttributes {
	attack?: number;
	affinity?: number;
	damageDragon?: number;
	damageFire?: number;
	damageIce?: number;
	damageThunder?: number;
	damageWater?: number;
	resistAll?: number;
	sharpnessBonus?: number;
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
