import {Id} from './Model';
import {Ailment, IAilmentPayload} from './Models/Ailment';
import {Armor, ArmorPayload} from './Models/Armor';
import {ArmorSet, IArmorSetCreatePayload, IArmorSetUpdatePayload} from './Models/ArmorSet';
import {ArmorSetBonus, IArmorSetBonusCreatePayload, IArmorSetBonusUpdatePayload} from './Models/ArmorSetBonus';
import {Charm, ICharmCreatePayload, ICharmUpdatePayload} from './Models/Charm';
import {Decoration, DecorationUpdatePayload, IDecorationCreatePayload} from './Models/Decoration';
import {Item, ItemPayload} from './Models/Item';
import {Location, LocationPayload} from './Models/Location';
import {Monster, MonsterPayload} from './Models/Monster';
import {MotionValue, MotionValuePayload} from './Models/MotionValue';
import {Skill, SkillPayload} from './Models/Skill';
import {User, UserCreatePayload, UserPayload} from './Models/User';
import {Weapon, WeaponCreatePayload, WeaponPayload, WeaponType} from './Models/Weapon';
import {WorldEvent} from './Models/WorldEvent';

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
			body: Partial<IAilmentPayload>;
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

	// region Armor Sets
	'/armor/sets': {
		GET: {
			query: IQueryable & IProjectable;
			response: ArmorSet[];
		};

		PUT: {
			body: IArmorSetCreatePayload;
			query: IProjectable;
			response: ArmorSet;
		};
	};

	'/armor/sets/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: ArmorSet;
		};

		PATCH: {
			body: IArmorSetUpdatePayload;
			params: Identity;
			query: IProjectable;
			response: ArmorSet;
		};
	};
	// endregion

	// region Armor Set Bonuses
	'/armor/sets/bonuses': {
		GET: {
			query: IQueryable & IProjectable;
			response: ArmorSetBonus[];
		};

		PUT: {
			body: IArmorSetBonusCreatePayload;
			query: IProjectable;
			response: ArmorSetBonus;
		};
	};

	'/armor/sets/bonuses/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: ArmorSetBonus;
		};

		PATCH: {
			body: IArmorSetBonusUpdatePayload;
			params: Identity;
			query: IProjectable;
			response: ArmorSetBonus;
		};
	};
	// endregion

	// region Charms
	'/charms': {
		GET: {
			query: IQueryable & IProjectable;
			response: Charm[];
		};

		PUT: {
			body: ICharmCreatePayload;
			query: IProjectable;
			response: Charm;
		};
	};

	'/charms/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: Charm;
		};

		PATCH: {
			body: ICharmUpdatePayload;
			params: Identity;
			query: IProjectable;
			response: Charm;
		};
	};
	// endregion

	// region Decorations
	'/decorations': {
		GET: {
			query: IQueryable & IProjectable;
			response: Decoration[];
		};

		PUT: {
			body: IDecorationCreatePayload;
			query: IProjectable;
			response: Decoration;
		};
	};

	'/decorations/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: Decoration;
		};

		PATCH: {
			body: DecorationUpdatePayload;
			params: Identity;
			query: IProjectable;
			response: Decoration;
		}
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
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity,
			query: IProjectable;
			response: Item;
		};

		PATCH: {
			body: ItemPayload;
			params: Identity;
			query: IProjectable;
			response: Item;
		}
	};
	// endregion

	// region Locations
	'/locations': {
		GET: {
			query: IQueryable & IProjectable;
			response: Location[];
		};

		PUT: {
			body: LocationPayload;
			query: IProjectable;
			response: Location;
		};
	};

	'/locations/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			query: IProjectable;
			params: Identity;
			response: Location;
		};

		PATCH: {
			body: Partial<LocationPayload>;
			params: Identity;
			query: IProjectable;
			response: Location;
		};
	};
	// endregion

	// region Monsters
	'/monsters': {
		GET: {
			query: IQueryable & IProjectable;
			response: Monster[];
		};

		PUT: {
			body: MonsterPayload;
			query: IProjectable;
			response: Monster;
		};
	};

	'/monsters/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			query: IProjectable;
			params: Identity;
			response: Monster;
		};

		PATCH: {
			body: MonsterPayload;
			params: Identity;
			query: IProjectable;
			response: Monster;
		};
	};
	// endregion

	// region Motion Values
	'/motion-values': {
		GET: {
			query: IQueryable & IProjectable;
			response: MotionValue[];
		};

		PUT: {
			body: MotionValuePayload;
			query: IProjectable;
			response: MotionValue;
		};
	};

	'/motion-values/:weaponType': {
		GET: {
			query: IProjectable;
			params: {
				weaponType: WeaponType;
			};
			response: MotionValue[];
		};
	};

	'/motion-values/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			query: IProjectable;
			params: Identity;
			response: MotionValue;
		};

		PATCH: {
			query: IProjectable;
			params: Identity;
			response: MotionValue;
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

	// region Users
	'/users': {
		GET: {
			query: IQueryable & IProjectable;
			response: User[];
		};

		PUT: {
			body: UserCreatePayload;
			query: IProjectable;
			response: User;
		};
	};

	'/users/activate/:code': {
		POST: {
			body: {
				password: string;
			};
			query: IProjectable;
			response: User;
		};
	};

	'/users/password-reset': {
		POST: {
			body: {
				email: string;
				passwordResetUrl: string;
			};
			response: void;
		};
	};

	'/users/password-reset/:code': {
		POST: {
			body: {
				password: string;
			};
			response: void;
		};
	};

	'/users/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: User;
		};

		PATCH: {
			body: UserPayload;
			params: Identity;
			query: IProjectable;
			response: User;
		};
	};
	// endregion

	// region Weapons
	'/weapons': {
		GET: {
			query: IQueryable & IProjectable;
			response: Weapon[];
		};

		PUT: {
			body: WeaponPayload;
			query: IProjectable;
			response: Weapon;
		};
	};

	'/weapons/:id': {
		DELETE: {
			params: Identity;
			response: void;
		};

		GET: {
			params: Identity;
			query: IProjectable;
			response: Weapon;
		};

		PATCH: {
			body: WeaponPayload;
			params: Identity;
			query: IProjectable;
			response: Weapon;
		};
	};
	// endregion

	// region World Events
	'/events': {
		GET: {
			query: IQueryable & IProjectable;
			response: WorldEvent[];
		};
	};

	'/events/:id': {
		GET: {
			params: Identity;
			query: IProjectable;
			response: WorldEvent;
		};
	};
	// endregion
}
