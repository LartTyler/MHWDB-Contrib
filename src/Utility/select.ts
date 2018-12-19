export const filterStrings = (query: string, items: string[]): string[] => {
	query = query.toLowerCase();

	return items.filter(item => item.toLowerCase().indexOf(query) !== -1);
};
