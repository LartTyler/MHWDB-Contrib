import * as React from 'react';
import {ArmorSetBonus, ArmorSetBonusModel} from '../../../Api/Models/ArmorSetBonus';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

export const armorSetBonusSorter = createEntitySorter<ArmorSetBonus>('name');

const filterOnName = createEntityFilter<ArmorSetBonus>('name');

interface IState {
	bonuses: ArmorSetBonus[];
	loading: boolean;
}

const ArmorSetBonusEntityList = EntityList.ofType<ArmorSetBonus>();

export class ArmorSetBonusList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		bonuses: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<ArmorSetBonusEntityList
				basePath="/objects/armor-sets/bonuses"
				columns={[
					{
						dataIndex: 'name',
						onFilter: filterOnName,
						title: 'Name',
					},
					{
						render: bonus => `${bonus.ranks.length} Rank${bonus.ranks.length !== 1 ? 's' : ''}`,
						title: 'Ranks',
					},
				]}
				entities={this.state.bonuses}
				loading={this.state.loading}
				noDataPlaceholder="No armor set bonuses found."
				onDeleteClick={this.onBonusDelete}
				onRefreshClick={this.load}
				title="Armor Set Bonuses"
			/>
		);
	}

	private onBonusDelete = (target: ArmorSetBonus) => ArmorSetBonusModel.delete(target.id).then(() => this.setState({
		bonuses: this.state.bonuses.filter(bonus => bonus !== target),
	}));

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		ArmorSetBonusModel.list(null, {
			id: true,
			name: true,
			'ranks.pieces': true,
		}).then(response => this.setState({
			bonuses: response.data.sort(armorSetBonusSorter),
			loading: false,
		}));
	};
}
