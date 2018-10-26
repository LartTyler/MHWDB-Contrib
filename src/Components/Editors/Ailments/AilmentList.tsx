import * as React from 'react';
import {IAilment} from '../../../Api/Objects/Ailment';
import {compareFields} from '../../../Api/Objects/Entity';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {EntityList} from '../EntityList';

type Ailment = Pick<IAilment, 'id' | 'name' | 'description'>;
type FilterableKeys = 'name' | 'description';

const filterRecord = (key: FilterableKeys, record: Ailment, search: string) =>
	record[key].toLowerCase().indexOf(search) > -1;

const filterRecordOnName = (record: Ailment, search: string) => filterRecord('name', record, search);
const filterRecordOnDescription = (record: Ailment, search: string) => filterRecord('description', record, search);

const sorter = (a: Ailment, b: Ailment) => compareFields('name', a, b);

class AilmentListComponent extends React.PureComponent<IApiClientAware> {
	public render(): JSX.Element {
		return (
			<EntityList
				basePath="/edit/ailments"
				projection={{
					description: true,
					id: true,
					name: true,
				}}
				provider={this.props.client.ailments}
				sorter={sorter}
				tableColumns={[
					{
						dataIndex: 'name',
						onFilter: filterRecordOnName,
						style: {
							minWidth: 250,
						},
						title: 'Name',
					},
					{
						dataIndex: 'description',
						onFilter: filterRecordOnDescription,
						title: 'Description',
					},
				]}
				tableNoDataPlaceholder={<span>No ailments found.</span>}
				title="Ailments"
			/>
		);
	}
}

export const AilmentList = withApiClient(AilmentListComponent);
