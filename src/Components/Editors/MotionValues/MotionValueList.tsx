import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {MotionValue, MotionValueModel} from '../../../Api/Models/MotionValue';
import {WeaponType, weaponTypeLabels} from '../../../Api/Models/Weapon';
import {ucfirst} from '../../../Utility/string';
import {Manager} from '../../Manager/Manager';
import {ManagerHeader} from '../../Manager/ManagerHeader';
import {RefreshButton} from '../../Manager/RefreshButton';
import {RowControls} from '../../Manager/RowControls';
import {SearchInput} from '../../Search';
import {createEntityFilter} from '../EntityList';

const filterOnName = createEntityFilter<MotionValue>('name');

interface IRouteProps {
	weaponType: WeaponType;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	loading: boolean;
	motionValues: MotionValue[];
	search: string;
}

class MotionValueListComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		loading: false,
		motionValues: [],
		search: '',
	};

	public componentDidMount(): void {
		this.load();
	}

	public componentDidUpdate(prevProps: Readonly<IProps>): void {
		if (this.props.match.params.weaponType === prevProps.match.params.weaponType)
			return;

		this.load();
	}

	public render(): React.ReactNode {
		const type = this.props.match.params.weaponType;
		const label = weaponTypeLabels[type];

		const Controls = RowControls.ofType<MotionValue>();

		return (
			<Manager>
				<ManagerHeader
					title={`${label} Motion Values`}
					refresh={<RefreshButton onRefresh={this.load} />}
					search={<SearchInput onSearch={this.onSearchInputChange} />}
				/>

				<Table
					columns={[
						{
							dataIndex: 'name',
							onFilter: filterOnName,
							title: 'Name',
						},
						{
							render: mv => ucfirst(mv.damageType),
							title: 'Damage Type',
						},
						{
							render: mv => `${mv.hits.length} Hit${mv.hits.length !== 1 ? 's' : ''}`,
							title: 'Hits',
						},
						{
							align: 'right',
							render: mv => (
								<Controls
									entity={mv}
									editPath={`/edit/motion-values/${type}/${mv.id}`}
									onDelete={this.onMotionValueDelete}
								/>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.state.motionValues}
					fullWidth={true}
					htmlTableProps={{
						interactive: true,
						striped: true,
					}}
					loading={this.state.loading}
					noDataPlaceholder={`No motion values found for ${label}.`}
					rowKey="id"
					searchText={this.state.search}
					pageSize={15}
				/>
			</Manager>
		);
	}

	private onMotionValueDelete = (target: MotionValue) => MotionValueModel.delete(target.id).then(() => this.setState({
		motionValues: this.state.motionValues.filter(mv => mv !== target),
	}));

	private onSearchInputChange = (query: string) => this.setState({
		search: query.toLowerCase(),
	});

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		MotionValueModel.listByType(this.props.match.params.weaponType).then(response => this.setState({
			loading: false,
			motionValues: response.data,
		}));
	};
}

export const MotionValueList = withRouter(MotionValueListComponent);
