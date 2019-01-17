import {IEntity} from '../_Api/Objects/Entity';

export const filterStrings = (query: string, items: string[]): string[] => {
	query = query.toLowerCase();

	return items.filter(item => item.toLowerCase().indexOf(query) !== -1);
};

export const createEntityListFilter = <T extends IEntity>(key: keyof T) => (query: string, items: T[]) => {
	if (!query)
		return items;

	query = query.toLowerCase();

	return items.filter(item => {
		let value: any = item[key];

		if (typeof value === 'number')
			value = value.toString(10);
		else if (typeof value !== 'string')
			throw new Error('Entities can only be filtered on string or numeric fields');

		return value.toLowerCase().indexOf(query) !== -1;
	});
};

export const createEntityListSorter = <T extends IEntity>(key: keyof T) => (items: T[]) => items.sort((a, b) => {
	if (a[key] < b[key])
		return -1;
	else if (a[key] > b[key])
		return 1;

	return 0;
});
