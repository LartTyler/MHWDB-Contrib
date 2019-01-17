import {Item, ItemPayload} from './Models/Item';

interface IProjection<T extends boolean> {
	[key: string]: T;
}

export type Projection = IProjection<true> | IProjection<false>;

export interface IProjectable {
	p: Projection;
}

export type Scalar = string | number | boolean;
export type ConditionKeys = '$gt' | '$gte';

export type Condition = {
	[key in ConditionKeys]: Scalar;
};

export interface IQueryDocument {
	[key: string]: Scalar | Condition | IQueryDocument[];

	'$and'?: IQueryDocument[];
	'$or'?: IQueryDocument[];
}

export interface IQueryable {
	q: IQueryDocument;
}

export interface IMonHunDBRoutes {
	'/auth': {
		POST: {
			body: {
				username: string;
				password: string;
			};
			response: {
				token: string;
			};
		};
	};
	'/auth/refresh': {
		GET: {
			response: {
				token: string;
			};
		};
	};
	'/items': {
		GET: {
			query: IQueryable & IProjectable;
			response: Item[];
		};
		PUT: {
			body: ItemPayload;
			query: IProjectable;
			response: Item;
		};
	};
	'/items/:id': {
		GET: {
			params: {
				id: string | number;
			},
			query: IProjectable;
			response: Item;
		};
	};
}
