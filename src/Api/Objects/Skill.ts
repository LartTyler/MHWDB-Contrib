import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {IEntity} from './Entity';

export interface ISkillRank extends IEntity {
	skill?: number;
	skillName?: string;
	level?: number;
	description?: string;
	modifiers?: {[key: string]: string | number | boolean};
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
