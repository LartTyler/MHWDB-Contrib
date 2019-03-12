import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {DamageType, WeaponType} from './Weapon';

interface IMotionValue extends IEntity {
	name: string;
	weaponType: WeaponType;
	damageType: DamageType;
	stun: number;
	exhaust: number;
	hits: number[];
}

export type MotionValue = Partial<IMotionValue>;

export type MotionValuePayload = Omit<MotionValue, 'name' | 'weaponType'> & {
	name: string;
	weaponType: WeaponType;
};

export class MotionValueModel {
	public static list(query: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/motion-values', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static listByType(weaponType: WeaponType, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/motion-values/:weaponType'>(`/motion-values/${weaponType}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static create(payload: MotionValuePayload, projection?: Projection) {
		return client.put('/motion-values', payload, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/motion-values/:id'>(`/motion-values/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, payload: MotionValue, projection?: Projection) {
		return client.patch<'/motion-values/:id'>(`/motion-values/${id}`, payload, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/motion-values/:id'>(`/motion-values/${id}`);
	}
}
