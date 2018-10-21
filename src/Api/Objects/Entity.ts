export interface IEntity {
	id?: number;
}

export type Identifiable<T extends IEntity> = Pick<T, 'id'> | number;

export const toIdentifier = <T extends IEntity>(identifiable: Identifiable<T>): number => {
	return typeof identifiable === 'number' ? identifiable : identifiable.id;
};
