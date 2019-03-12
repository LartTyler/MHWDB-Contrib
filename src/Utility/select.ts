import {Entity} from '../Api/Model';

export const filterStrings = (query: string, items: string[]): string[] => {
	query = query.toLowerCase();

	return items.filter(item => item.toLowerCase().indexOf(query) !== -1);
};

export const createEntityListFilter = <T extends Entity>(key: keyof T) => (query: string, items: T[]) => {
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
