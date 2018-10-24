export interface IEntity {
	id?: number;
}

export type Identifiable<T extends IEntity> = Pick<T, 'id'> | number;

export const toIdentifier = <T extends IEntity>(identifiable: Identifiable<T>): number => {
	return typeof identifiable === 'number' ? identifiable : identifiable.id;
};

export const compareFields = <T>(key: keyof T, a: T, b: T): -1 | 0 | 1 => {
	const aVal = a[key];
	const bVal = b[key];

	if (aVal > bVal)
		return 1;
	else if (aVal < bVal)
		return -1;

	return 0;
};
