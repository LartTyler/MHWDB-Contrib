import * as React from 'react';
import {ISkill} from '../../../Api/Objects/Skill';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

type Skill = Pick<ISkill, 'id' | 'name' | 'description'>;

const sorter = createEntitySorter<Skill>('name');

const filterEntityOnName = createEntityFilter<Skill>('name');
const filterEntityOnDescription = createEntityFilter<Skill>('description');

const SkillListComponent: React.SFC<IApiClientAware> = props => (
	<EntityList
		basePath="/edit/skills"
		projection={{
			description: true,
			name: true,
		}}
		provider={props.client.skills}
		sorter={sorter}
		tableColumns={[
			{
				dataIndex: 'name',
				onFilter: filterEntityOnName,
				style: {
					minWidth: 200,
				},
				title: 'Name',
			},
			{
				dataIndex: 'description',
				onFilter: filterEntityOnDescription,
				title: 'Description',
			}
		]}
		tableNoDataPlaceholder={<span>No skills found.</span>}
		title="Skills"
	/>
);

export const SkillList = withApiClient(SkillListComponent);
