import * as React from 'react';
import {IItem} from '../../../Api/Objects/Item';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

type Item = Pick<IItem, 'id' | 'name' | 'description'>;

const sorter = createEntitySorter<Item>('name');

const filterEntityOnName = createEntityFilter<Item>('name');
const filterEntityOnDescription = createEntityFilter<Item>('description');

const ItemListComponent: React.FC<IApiClientAware> = props => (
	<EntityList
		basePath="/edit/items"
		projection={{
			description: true,
			name: true,
		}}
		provider={props.client.items}
		sorter={sorter}
		tableColumns={[
			{
				dataIndex: 'name',
				onFilter: filterEntityOnName,
				style: {
					minWidth: 250,
				},
				title: 'Name',
			},
			{
				dataIndex: 'description',
				onFilter: filterEntityOnDescription,
				title: 'Description',
			},
		]}
		tableNoDataPlaceholder={<span>No items found.</span>}
		title="Items"
	/>
);

export const ItemList = withApiClient(ItemListComponent);
