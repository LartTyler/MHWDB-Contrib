import * as React from 'react';
import {Charm, CharmModel} from '../../../Api/Models/Charm';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

const sorter = createEntitySorter<Charm>('name');

const filterOnName = createEntityFilter<Charm>('name');

interface IState {
	charms: Charm[];
	loading: boolean;
}

const CharmEntityList = EntityList.ofType<Charm>();

export class CharmList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		charms: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<CharmEntityList
				basePath="/edit/charms"
				columns={[
					{
						dataIndex: 'name',
						onFilter: filterOnName,
						title: 'Name',
					},
					{
						render: charm => `${charm.ranks.length} Rank${charm.ranks.length !== 1 ? 's' : ''}`,
						title: 'Ranks',
					},
				]}
				entities={this.state.charms}
				loading={this.state.loading}
				noDataPlaceholder="No charms found."
				onDeleteClick={this.onCharmDelete}
				onRefreshClick={this.load}
				title="Charms"
			/>
		);
	}

	private onCharmDelete = (target: Charm) => {
		return CharmModel.delete(target.id).then(() => this.setState({
			charms: this.state.charms.filter(charm => charm !== target),
		}));
	};

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		CharmModel.list(null, {
			id: true,
			name: true,
			'ranks.id': true,
		}).then(response => this.setState({
			charms: response.data.sort(sorter),
			loading: false,
		}));
	};
}
