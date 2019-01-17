import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {IEntity} from './Entity';

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
