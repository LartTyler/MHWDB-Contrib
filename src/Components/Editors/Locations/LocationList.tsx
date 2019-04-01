import {Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Location, LocationModel} from '../../../Api/Models/Location';
import {toaster} from '../../../toaster';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

export const locationSorter = createEntitySorter<Location>('name');

const filterEntityOnName = createEntityFilter<Location>('name');

interface IState {
	loading: boolean;
	locations: Location[];
}

const LocationEntityList = EntityList.ofType<Location>();

export class LocationList extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		loading: true,
		locations: [],
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<LocationEntityList
				basePath="/edit/locations"
				columns={[
					{
						dataIndex: 'name',
						onFilter: filterEntityOnName,
						title: 'Name',
					},
					{
						dataIndex: 'zoneCount',
						title: 'Zone Count',
					},
					{
						render: location => location.camps.length,
						title: 'Camp Count',
					},
				]}
				entities={this.state.locations}
				loading={this.state.loading}
				noDataPlaceholder={<div style={{marginBottom: 10}}>No locations found.</div>}
				onDeleteClick={this.onLocationDelete}
				onRefreshClick={this.load}
				title="Locations"
			/>
		);
	}

	private onLocationDelete = (target: Location) => {
		return LocationModel.delete(target.id).then(() => this.setState({
			locations: this.state.locations.filter(location => location !== target),
		})).catch((error: Error) => {
			toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});
		});
	};

	private load = () => {
		LocationModel.list().then(response => this.setState({
			loading: false,
			locations: response.data.sort(locationSorter),
		}));
	};
}
