import * as React from 'react';
import {Skill, SkillModel} from '../../../Api/Models/Skill';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

const sorter = createEntitySorter<Skill>('name');

const filterEntityOnName = createEntityFilter<Skill>('name');
const filterEntityOnDescription = createEntityFilter<Skill>('description');

interface IState {
	loading: boolean;
	skills: Skill[];
}

const SkillEntityList = EntityList.ofType<Skill>();

export class SkillList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		skills: [],
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<SkillEntityList
				basePath="/edit/skills"
				columns={[
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
					},
				]}
				entities={this.state.skills}
				loading={this.state.loading}
				noDataPlaceholder={<span>No skills found.</span>}
				onDeleteClick={this.onDelete}
				onRefreshClick={this.load}
				title="Skills"
			/>
		);
	}

	private onDelete = (target: Skill) => {
		return SkillModel.delete(target.id).then(() => this.setState({
			skills: this.state.skills.filter(skill => skill !== target),
		}));
	};

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		SkillModel.list(null, {
			description: true,
			id: true,
			name: true,
		}).then(response => this.setState({
			loading: false,
			skills: response.data.sort(sorter),
		}));
	};
}
