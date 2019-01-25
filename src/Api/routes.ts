import {Id} from './Model';
import {Ailment, IAilmentPayload} from './Models/Ailment';
import {Armor, ArmorPayload} from './Models/Armor';
import {Item, ItemPayload} from './Models/Item';
import {Skill, SkillPayload} from './Models/Skill';

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

export interface Identity {
	id: Id;
}

export interface IMonHunDBRoutes {
	// region Authentication
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
	// endregion

	// region Ailments
	'/ailments': {
		GET: {
			query: IQueryable & IProjectable;
			response: Ailment[];
		};

		PUT: {
			body: IAilmentPayload;
			query: IProjectable;
			response: Ailment;
		};
	};

	'/ailments/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: Ailment;
		};

		PATCH: {
			body: IAilmentPayload;
			params: Identity;
			query: IProjectable;
			response: Ailment;
		}
	};
	// endregion

	// region Armor
	'/armor': {
		GET: {
			query: IQueryable & IProjectable;
			response: Armor[];
		};

		PUT: {
			body: ArmorPayload;
			query: IProjectable;
			response: Armor;
		};
	};

	'/armor/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: Armor;
		};

		PATCH: {
			body: ArmorPayload;
			params: Identity;
			query: IProjectable;
			response: Armor;
		};
	};
	// endregion

	// region Items
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
			params: Identity,
			query: IProjectable;
			response: Item;
		};
	};
	// endregion

	// region Skills
	'/skills': {
		GET: {
			query: IQueryable & IProjectable;
			response: Skill[];
		};

		PUT: {
			body: SkillPayload;
			query: IProjectable;
			response: Skill;
		};
	};

	'/skills/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: Skill;
		};

		PATCH: {
			body: SkillPayload;
			params: Identity;
			query: IProjectable;
			response: Skill;
		};
	};
	// endregion
}
