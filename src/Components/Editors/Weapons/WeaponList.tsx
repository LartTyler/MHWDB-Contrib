import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {Weapon, WeaponModel, WeaponType, weaponTypeLabels} from '../../../Api/Models/Weapon';
import {createEntityFilter, createEntitySorter, EntityList} from '../EntityList';

export const weaponSorter = createEntitySorter<Weapon>('name');

const filterOnName = createEntityFilter<Weapon>('name');

interface IRouteProps {
	weaponType: WeaponType;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	loading: boolean;
	weapons: Weapon[];
}

const WeaponEntityList = EntityList.ofType<Weapon>();

class WeaponListComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		loading: false,
		weapons: [],
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

		return (
			<WeaponEntityList
				basePath={`/edit/weapons/${type}`}
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
				entities={this.state.weapons}
				loading={this.state.loading}
				noDataPlaceholder="No weapons found."
				onDeleteClick={this.onWeaponDelete}
				onRefreshClick={this.load}
				title={weaponTypeLabels[type]}
			/>
		);
	}

	private onWeaponDelete = (target: Weapon) => Promise.resolve().then(() => this.setState({
		weapons: this.state.weapons.filter(weapon => weapon !== target),
	}));

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		WeaponModel.listByType(this.props.match.params.weaponType).then(response => this.setState({
			loading: false,
			weapons: response.data.sort(weaponSorter),
		}));
	};
}

export const WeaponList = withRouter(WeaponListComponent);
