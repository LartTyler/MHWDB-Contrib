import {ApiClient, IApiClientModule} from '../ApiClient';
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

export class ItemApiClientModule implements IApiClientModule<IItem> {
	protected client: ApiClient;

	public constructor(client: ApiClient) {
		this.client = client;
	}

	public delete(target: Identifiable<IItem>): Promise<void> {
		return this.client.delete(`/items/${toIdentifier(target)}`);
	}

	public get(target: Identifiable<IItem>, projection?: Projection): Promise<IItem> {
		return this.client.read(`/items/${toIdentifier(target)}`, projection);
	}

	public list(query?: IQueryDocument, projection?: Projection): Promise<IItem[]> {
		return this.client.list('/items', query, projection);
	}

	public update(target: Identifiable<IItem>, values: IItem, projection?: Projection): Promise<IItem> {
		return this.client.update(`/items/${toIdentifier(target)}`, values, projection);
	}
}
