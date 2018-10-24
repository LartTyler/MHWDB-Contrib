import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule, IApiClientModule} from '../Module';
import {Projection} from '../Projection';
import {IQueryDocument} from '../Query';
import {Identifiable, IEntity, toIdentifier} from './Entity';

export interface IItem extends IEntity {
	name?: string;
	description?: string;
	rarity?: number;
	carryLimit?: number;
	value?: number;
}

export class ItemApiClientModule extends AbstractApiClientModule<IItem> {
	public constructor(client: ApiClient) {
		super(client, '/items');
	}
}
