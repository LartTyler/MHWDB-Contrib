import {ApiClient, IApiClientModule} from '../ApiClient';
import {Projection} from '../Projection';
import {IQueryDocument} from '../Query';
import {Identifiable, IEntity, toIdentifier} from './Entity';
import {Item} from './Item';
import {Skill} from './Skill';

enum RecoveryActions {
	DODGE = 'dodge',
}

export interface IAilmentRecovery {
	actions?: RecoveryActions[];
	items?: Item[];
}

export interface IAilmentProtection {
	items?: Item[];
	skills?: Array<Pick<Skill, 'id' | 'name' | 'description'>>;
}

export interface IAilment extends IEntity {
	name?: string;
	description?: string;
	recovery?: IAilmentRecovery;
	protection?: IAilmentProtection;
}

export class AilmentApiClientModule implements IApiClientModule<IAilment> {
	protected client: ApiClient;

	public constructor(client: ApiClient) {
		this.client = client;
	}

	public list(query?: IQueryDocument, projection?: Projection): Promise<IAilment[]> {
		return this.client.list('/ailments', query, projection);
	}

	public delete(target: Identifiable<IAilment>): Promise<void> {
		return this.client.delete(`/ailments/${toIdentifier(target)}`);
	}

	public get(target: Identifiable<IAilment>, projection?: Projection): Promise<IAilment> {
		return this.client.read(`/ailments/${toIdentifier(target)}`, projection);
	}

	public update(target: Identifiable<IAilment>, values: IAilment, projection?: Projection): Promise<IAilment> {
		return this.client.update(`/ailments/${toIdentifier(target)}`, values, projection);
	}
}
