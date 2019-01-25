import {CancelToken} from 'axios';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';

interface IItem extends IEntity {
	carryLimit: number;
	description: string;
	id: number;
	name: string;
	rarity: number;
	value: number;
}

interface ICraftingCost {
	quantity: number;
	item: Item;
}

export type Item = Partial<IItem>;
export type CraftingCost = Partial<ICraftingCost>;

export type ItemPayload = Item & {
	description: string;
	name: string;
	rarity: number;
};

export class ItemModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/items', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: ItemPayload, projection?: Projection) {
		return client.put('/items', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/items/:id'>(`/items/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: Partial<ItemPayload>, projection?: Projection) {
		return client.patch<'/items/:id'>(`/items/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/items/:id'>(`/items/${id}`);
	}
}
