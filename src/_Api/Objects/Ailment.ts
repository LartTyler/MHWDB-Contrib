import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {IEntity, Normalized, toIdArray} from './Entity';
import {IItem} from './Item';
import {ISkill} from './Skill';

export enum RecoveryAction {
	DODGE = 'dodge',
}

export interface IAilmentRecovery {
	actions?: RecoveryAction[];
	items?: IItem[];
}

export interface IAilmentProtection {
	items?: IItem[];
	skills?: Array<Pick<ISkill, 'id' | 'name' | 'description'>>;
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

	protected normalize(entity: IAilment): object {
		const output: Normalized<IAilment> = {...entity};

		if (entity.protection) {
			output.protection = {...entity.protection};

			if (entity.protection.items)
				output.protection.items = toIdArray(entity.protection.items);

			if (entity.protection.skills)
				output.protection.skills = toIdArray(entity.protection.skills);
		}

		if (entity.recovery) {
			output.recovery = {...entity.recovery};

			if (entity.recovery.items)
				output.recovery.items = toIdArray(entity.recovery.items);
		}

		return output;
	}
}
