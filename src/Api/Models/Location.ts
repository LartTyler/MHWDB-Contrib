import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';

interface ILocation extends IEntity {
	camps: Camp[];
	name: string;
	zoneCount: number;
}

interface ICamp extends IEntity {
	name: string;
	zone: number;
}

export type Location = Partial<ILocation>;
export type Camp = Partial<ICamp>;

export type LocationPayload = Omit<ILocation, 'id'>;

export class LocationModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/locations', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: LocationPayload, projection?: Projection) {
		return client.put('/locations', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/locations/:id'>(`/locations/${id}`, {
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: LocationPayload, projection?: Projection) {
		return client.patch<'/locations/:id'>(`/locations/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/locations/:id'>(`/locations/${id}`);
	}
}
