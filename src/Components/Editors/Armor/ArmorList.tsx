import * as React from 'react';
import {IArmor} from '../../../_Api/Objects/Armor';
import {ucfirst} from '../../../Utility/string';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {createEntityFilter, createEntitySorter, entityList} from '../EntityList';

type Armor = Pick<IArmor, 'id' | 'name' | 'rank' | 'type' | 'rarity'>;

const sorter = createEntitySorter<Armor>('name');

const filterEntityOnName = createEntityFilter<Armor>('name');
const filterEntityOnRank = createEntityFilter<Armor>('rank');
const filterEntityOnType = createEntityFilter<Armor>('type');

const ArmorListComponent: React.FC<IApiClientAware> = props => (
	<_EntityList
		basePath="/edit/armor"
		projection={{
			name: true,
			rank: true,
			rarity: true,
			type: true,
		}}
		provider={props.client.armor}
		sorter={sorter}
		tableColumns={[
			{
				dataIndex: 'name',
				onFilter: filterEntityOnName,
				title: 'Name',
			},
			{
				onFilter: filterEntityOnType,
				render: record => ucfirst(record.type),
				title: 'Type',
			},
			{
				onFilter: filterEntityOnRank,
				render: record => ucfirst(record.rank),
				title: 'Rank',
			},
			{
				align: 'right',
				dataIndex: 'rarity',
				title: 'Rarity',
			},
		]}
		tableNoDataPlaceholder={<span>No armor found.</span>}
		title="Armor"
	/>
);

export const ArmorList = withApiClient(ArmorListComponent);
