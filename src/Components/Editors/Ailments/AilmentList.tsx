import * as React from 'react';
import {IAilment} from '../../../Api/Objects/Ailment';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

type Ailment = Pick<IAilment, 'id' | 'name' | 'description'>;

const sorter = createEntitySorter<Ailment>('name');

const filterEntityOnName = createEntityFilter<Ailment>('name');
const filterEntityOnDescription = createEntityFilter<Ailment>('description');

const AilmentListComponent: React.SFC<IApiClientAware> = props => (
	<EntityList
		basePath="/edit/ailments"
		projection={{
			description: true,
			id: true,
			name: true,
		}}
		provider={props.client.ailments}
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
		tableNoDataPlaceholder={<span>No ailments found.</span>}
		title="Ailments"
	/>
);

export const AilmentList = withApiClient(AilmentListComponent);
