import {ButtonGroup, Checkbox, FormGroup, Button, Classes} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {CraftingCost, Item, ItemModel} from '../../../Api/Models/Item';
import {Weapon, WeaponCrafting, WeaponModel} from '../../../Api/Models/Weapon';
import {itemSorter} from '../CraftingCostDialog';
import {weaponSorter} from './WeaponList';

interface IProps {
	crafting: WeaponCrafting;
}

interface IState {
	branches: Weapon[];
	craftable: boolean;
	craftingMaterials: CraftingCost[];
	items: Item[];
	previous: Weapon;
	upgradeMaterials: CraftingCost[];
	weapons: Weapon[];
}

export class WeaponCraftingEditor extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			branches: [],
			craftable: props.crafting.craftable || false,
			craftingMaterials: [],
			items: null,
			previous: null,
			upgradeMaterials: [],
			weapons: null,
		};
	}

	public componentDidMount(): void {
		WeaponModel.list(null, {
			id: true,
			name: true,
		}).then(response => {
			const branches: Weapon[] = [];
			let previous: Weapon = null;

			for (const item of response.data) {
				if (this.props.crafting.branches.indexOf(item.id))
					branches.push(item);

				if (this.props.crafting.previous === item.id)
					previous = item;
			}

			this.setState({
				branches,
				previous,
				weapons: response.data.sort(weaponSorter),
			});
		});

		ItemModel.list(null, {
			id: true,
			name: true,
		}).then(response => this.setState({
			items: response.data.sort(itemSorter),
		}));
	}

	public render(): React.ReactNode {
		return (
			<>
				<Row>
					<Cell size={6}>
						<FormGroup label="Craftable">
							<Checkbox checked={this.state.craftable} onChange={this.onCraftableChange}>
								Weapon Is Craftable
							</Checkbox>
						</FormGroup>
					</Cell>

					<Cell size={6}>
						<FormGroup label="Built From (Previous)">
							<ButtonGroup fill={true}>
								<Select
									itemListPredicate={this.filterWeaponList}
									items={this.state.weapons}
									itemTextRenderer={this.renderWeaponText}
									loading={this.state.weapons === null}
									onItemSelect={this.onPreviousSelect}
									popoverProps={{
										className: 'full-width',
										targetClassName: 'full-width',
									}}
									selected={this.state.previous}
									virtual={true}
								/>

								{this.state.weapons !== null && (
									<Button className={Classes.FIXED} icon="cross" onClick={this.onPreviousReset} />
								)}
							</ButtonGroup>
						</FormGroup>
					</Cell>
				</Row>
			</>
		);
	}

	private renderWeaponText = (weapon: Weapon) => weapon.name;

	private filterWeaponList = (query: string, weapons: Weapon[]) => {
		query = query.toLowerCase();

		return weapons.filter(weapon => weapon.name.toLowerCase().indexOf(query) !== -1);
	};

	private onCraftableChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		craftable: event.currentTarget.checked,
	});

	private onPreviousReset = () => {
		this.setState({
			previous: null,
		});

		this.props.crafting.previous = null;
	};

	private onPreviousSelect = (previous: Weapon) => {
		this.setState({
			previous,
		});

		this.props.crafting.previous = previous ? previous.id : null;
	};
}
