import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule, IApiClientModule} from '../Module';
import {Projection} from '../Projection';
import {IQueryDocument} from '../Query';
import {Identifiable, IEntity, toIdentifier} from './Entity';
import {IItem} from './Item';
import {Skill} from './Skill';

export enum RecoveryAction {
	DODGE = 'dodge',
}

export interface IAilmentRecovery {
	actions?: RecoveryAction[];
	items?: IItem[];
}

export interface IAilmentProtection {
	items?: IItem[];
	skills?: Array<Pick<Skill, 'id' | 'name' | 'description'>>;
}

export interface IAilment extends IEntity {
	name?: string;
	description?: string;
	recovery?: IAilmentRecovery;
	protection?: IAilmentProtection;
}

export class AilmentApiClientModule extends AbstractApiClientModule<IAilment> {
	public constructor(client: ApiClient) {
		super(client, '/ailments');
	}
}
