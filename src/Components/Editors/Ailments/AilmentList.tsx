import {Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Ailment, AilmentModel} from '../../../Api/Models/Ailment';
import {toaster} from '../../../toaster';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

export const ailmentsSorter = createEntitySorter<Ailment>('name');

const filterEntityOnName = createEntityFilter<Ailment>('name');
const filterEntityOnDescription = createEntityFilter<Ailment>('description');

const AilmentEntityList = EntityList.ofType<Ailment>();

interface IState {
	ailments: Ailment[];
	loading: boolean;
}

export class AilmentList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		ailments: [],
		loading: false,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<AilmentEntityList
				basePath="/objects/ailments"
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
				entities={this.state.ailments}
				loading={this.state.loading}
				noDataPlaceholder={<span>No ailments found.</span>}
				onDeleteClick={this.onDelete}
				onRefreshClick={this.load}
				title="Ailments"
			/>
		);
	}

	private onDelete = (target: Ailment) => {
		return AilmentModel.delete(target.id).then(() => this.setState({
			ailments: this.state.ailments.filter(ailment => ailment !== target),
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

		AilmentModel.list(null, {
			description: true,
			id: true,
			name: true,
		}).then(response => this.setState({
			ailments: response.data.sort(ailmentsSorter),
			loading: false,
		}));
	};
}
