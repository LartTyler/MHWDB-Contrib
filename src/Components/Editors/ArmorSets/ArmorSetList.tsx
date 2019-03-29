import * as React from 'react';
import {ArmorSet, ArmorSetModel} from '../../../Api/Models/ArmorSet';
import {ucfirst} from '../../../Utility/string';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

export const armorSetSorter = createEntitySorter<ArmorSet>('name');

const filterOnName = createEntityFilter<ArmorSet>('name');

interface IState {
	armorSets: ArmorSet[];
	loading: boolean;
}

const ArmorSetEntityList = EntityList.ofType<ArmorSet>();

export class ArmorSetList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		armorSets: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<ArmorSetEntityList
				basePath="/edit/armor-sets"
				columns={[
					{
						dataIndex: 'name',
						onFilter: filterOnName,
						title: 'Name',
					},
					{
						render: set => ucfirst(set.rank),
						title: 'Rank',
					},
					{
						render: set => set.bonus ? set.bonus.name : <span>&mdash;</span>,
						title: 'Set Bonus',
					},
					{
						render: set => `${set.pieces.length} Piece${set.pieces.length !== 1 ? 's' : ''}`,
						title: 'Pieces',
					},
				]}
				entities={this.state.armorSets}
				loading={this.state.loading}
				noDataPlaceholder="No armor sets found."
				onDeleteClick={this.onArmorSetDelete}
				onRefreshClick={this.load}
				title="Armor Sets"
			/>
		);
	}

	private onArmorSetDelete = (target: ArmorSet) => ArmorSetModel.delete(target.id).then(() => this.setState({
		armorSets: this.state.armorSets.filter(set => set !== target),
	}));

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		ArmorSetModel.list(null, {
			'bonus.name': true,
			id: true,
			name: true,
			'pieces.id': true,
			rank: true,
		}).then(response => this.setState({
			armorSets: response.data.sort(armorSetSorter),
			loading: false,
		}));
	};
}
