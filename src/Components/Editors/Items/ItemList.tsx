import {Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Item as BaseItem, ItemModel} from '../../../Api/Models/Item';
import {toaster} from '../../Contexts/ToasterContext';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

type Item = Pick<BaseItem, 'id' | 'name' | 'description'>;

const sorter = createEntitySorter<Item>('name');

const filterEntityOnName = createEntityFilter<Item>('name');
const filterEntityOnDescription = createEntityFilter<Item>('description');

interface IState {
	items: Item[];
	loading: boolean;
}

const ItemEntityList = EntityList.ofType<Item>();

export class ItemList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		items: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<ItemEntityList
				basePath="/edit/items"
				columns={[
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
				entities={this.state.items}
				loading={this.state.loading}
				noDataPlaceholder="No items found."
				onDeleteClick={this.onItemDelete}
				onRefreshClick={this.load}
				title="Items"
			/>
		);
	}

	private onItemDelete = (target: Item) => {
		return ItemModel.delete(target.id).then(() => this.setState({
			items: this.state.items.filter(item => item !== target),
		})).catch(error => {
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

		ItemModel.list(null, {
			description: true,
			id: true,
			name: true,
		}).then(response => this.setState({
			items: response.data.sort(sorter),
			loading: false,
		}));
	};
}
