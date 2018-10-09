import {Ailment} from './Objects/Ailment';

export type Scalar = string | number | boolean;

export type ConditionOperators = '$gt' | '$gte' | '$lt' | '$lte' | '$eq' | '$neq' | '$in';

export type Conditional = {
	[key in ConditionOperators]?: Scalar;
};

export type Document = {
	[key: string]: Scalar | Conditional | Document;
	'$and'?: Document;
	'$or'?: Document;
};