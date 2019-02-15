import * as React from 'react';
import {Decoration, DecorationModel} from '../../../Api/Models/Decoration';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

const sorter = createEntitySorter<Decoration>('name');
const filterOnName = createEntityFilter<Decoration>('name');

const DecorationEntityList = EntityList.ofType<Decoration>();

interface IState {
	decorations: Decoration[];
	loading: boolean;
}

export class DecorationList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		decorations: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<DecorationEntityList
				basePath="/edit/decorations"
				columns={[
					{
						dataIndex: 'name',
						onFilter: filterOnName,
						title: 'Name',
					},
					{
						dataIndex: 'rarity',
						title: 'Rarity',
					},
				]}
				entities={this.state.decorations}
				loading={this.state.loading}
				noDataPlaceholder="No decorations found."
				onDeleteClick={this.onDecorationDelete}
				onRefreshClick={this.load}
				title="Decorations"
			/>
		);
	}

	private onDecorationDelete = (target: Decoration) => DecorationModel.delete(target.id).then(() => this.setState({
		decorations: this.state.decorations.filter(deco => deco !== target),
	}));

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		DecorationModel.list(null, {
			skills: false,
			slot: false,
		}).then(response => this.setState({
			decorations: response.data.sort(sorter),
			loading: false,
		}));
	};
}
