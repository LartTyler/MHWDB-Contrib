import * as React from 'react';
import {Monster, MonsterModel} from '../../../Api/Models/Monster';
import {ucfirst, ucwords} from '../../../Utility/string';
import {createEntitySorter, EntityList} from '../EntityList';

export const monsterSorter = createEntitySorter<Monster>('name');

const MonsterEntityList = EntityList.ofType<Monster>();

interface IState {
	loading: boolean;
	monsters: Monster[];
}

export class MonsterList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: false,
		monsters: [],
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<MonsterEntityList
				basePath="/objects/monsters"
				columns={[
					{
						dataIndex: 'name',
						title: 'Name',
					},
					{
						render: monster => ucfirst(monster.type),
						title: 'Type',
					},
					{
						render: monster => ucwords(monster.species),
						title: 'Species',
					},
				]}
				entities={this.state.monsters}
				loading={this.state.loading}
				noDataPlaceholder="No monsters found."
				onDeleteClick={this.onDelete}
				onRefreshClick={this.load}
				title="Monsters"
			/>
		);
	}

	private onDelete = (target: Monster) => MonsterModel.delete(target.id).then(() => this.setState({
		monsters: this.state.monsters.filter(monster => monster !== target),
	}));

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		MonsterModel.list().then(response => this.setState({
			loading: false,
			monsters: response.data.sort(monsterSorter),
		}));
	};
}
