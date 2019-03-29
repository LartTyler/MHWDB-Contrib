import {Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Armor, ArmorModel} from '../../../Api/Models/Armor';
import {toaster} from '../../../toaster';
import {ucfirst} from '../../../Utility/string';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

export const armorSorter = createEntitySorter<Armor>('name');

const filterEntityOnName = createEntityFilter<Armor>('name');
const filterEntityOnRank = createEntityFilter<Armor>('rank');
const filterEntityOnType = createEntityFilter<Armor>('type');

interface IState {
	armor: Armor[];
	loading: boolean;
}

const ArmorEntityList = EntityList.ofType<Armor>();

export class ArmorList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		armor: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<ArmorEntityList
				basePath="/edit/armor"
				columns={[
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
				entities={this.state.armor}
				loading={this.state.loading}
				noDataPlaceholder={<span>No armor found.</span>}
				onDeleteClick={this.onDelete}
				onRefreshClick={this.load}
				title="Armor"
			/>
		);
	}

	private onDelete = (target: Armor) => {
		return ArmorModel.delete(target.id).then(() => this.setState({
			armor: this.state.armor.filter(armor => armor !== target),
		})).catch((error: Error) => {
			toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});
		});
	};

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		ArmorModel.list(null, {
			id: true,
			name: true,
			rank: true,
			rarity: true,
			type: true,
		}).then(response => this.setState({
			armor: response.data.sort(armorSorter),
			loading: false,
		}));
	};
}
