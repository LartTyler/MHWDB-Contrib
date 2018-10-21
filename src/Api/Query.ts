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
