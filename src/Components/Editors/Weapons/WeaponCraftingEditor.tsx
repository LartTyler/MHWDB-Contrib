import {Button, ButtonGroup, Checkbox, Classes, FormGroup, H4} from '@blueprintjs/core';
import {Cell, MultiSelect, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {CraftingCost, Item, ItemModel} from '../../../Api/Models/Item';
import {Weapon, WeaponCrafting, WeaponModel, WeaponType} from '../../../Api/Models/Weapon';
import {itemSorter} from '../CraftingCostDialog';
import './WeaponCraftingEditor.scss';
import {weaponSorter} from './WeaponList';

interface IProps {
	crafting: WeaponCrafting;
	weaponId: number | string;
	weaponType: WeaponType;
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
		WeaponModel.list({
			type: this.props.weaponType,
		}, {
			id: true,
			name: true,
		}).then(response => {
			const weapons: Weapon[] = [];
			const branches: Weapon[] = [];
			let previous: Weapon = null;

			for (const item of response.data) {
				// tslint:disable-next-line:triple-equals
				if (item.id == this.props.weaponId)
					continue;

				if (this.props.crafting.branches.indexOf(item.id) !== -1)
					branches.push(item);

				if (this.props.crafting.previous === item.id)
					previous = item;

				weapons.push(item);
			}

			this.setState({
				branches,
				previous,
				weapons: weapons.sort(weaponSorter),
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
					<Cell size={2}>
						<FormGroup label="Craftable">
							<Checkbox checked={this.state.craftable} onChange={this.onCraftableChange}>
								Is Craftable
							</Checkbox>
						</FormGroup>
					</Cell>

					<Cell size={4}>
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

					<Cell size={6}>
						<FormGroup label="Upgrades Into (Branches)">
							<MultiSelect
								itemListPredicate={this.filterWeaponList}
								items={this.state.weapons}
								itemTextRenderer={this.renderWeaponText}
								loading={this.state.weapons === null}
								onClear={this.onBranchClear}
								onItemDeselect={this.onBranchDeselect}
								onItemSelect={this.onBranchSelect}
								popoverProps={{
									popoverClassName: 'branches-popover',
									targetClassName: 'full-width',
								}}
								selected={this.state.branches}
								virtual={true}
							/>
						</FormGroup>
					</Cell>
				</Row>

				{this.state.craftable && (
					<>
						<H4>Crafting Costs</H4>

						<Table
							columns={[
								{
									render: cost => cost.item.name,
									title: 'Name',
								},
								{
									dataIndex: 'quantity',
									style: {
										width: 100,
									},
									title: 'Quantity',
								},
								{
									align: 'right',
									render: cost => (
										<Button
											icon="cross"
											minimal={true}
											onClick={() => this.onCraftingCostRemove(cost)}
										/>
									),
									title: <span>&nbsp;</span>,
								},
							]}
							dataSource={this.state.craftingMaterials}
							fullWidth={true}
							loading={this.state.items === null}
							noDataPlaceholder={<div>Use the button below to add crafting material costs.</div>}
							rowKey={cost => cost.item.id.toString(10)}
						/>

						<Button icon="plus" style={{marginTop: 10}}>
							Add Item
						</Button>
					</>
				)}
			</>
		);
	}

	private renderWeaponText = (weapon: Weapon) => weapon.name;

	private filterWeaponList = (query: string, weapons: Weapon[]) => {
		query = query.toLowerCase();

		return weapons.filter(weapon => weapon.name.toLowerCase().indexOf(query) !== -1);
	};

	private onBranchClear = () => {
		this.setState({
			branches: [],
		});

		this.props.crafting.branches = [];
	};

	private onBranchDeselect = (target: Weapon) => {
		const branches = this.state.branches.filter(weapon => weapon !== target);

		this.setState({
			branches,
		});

		this.props.crafting.branches = branches.map(weapon => weapon.id);
	};

	private onBranchSelect = (weapon: Weapon) => {
		const branches = [...this.state.branches, weapon];

		this.setState({
			branches,
		});

		this.props.crafting.branches = branches.map(branch => branch.id);
	};

	private onCraftableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const craftable = event.currentTarget.checked;

		this.setState({
			craftable,
		});

		if (!craftable) {
			this.setState({
				craftingMaterials: [],
			});

			this.props.crafting.craftingMaterials = [];
		}

		this.props.crafting.craftable = craftable;
	};

	private onCraftingCostRemove = (target: CraftingCost) => {
		const craftingMaterials = this.state.craftingMaterials.filter(cost => cost !== target);

		this.setState({
			craftingMaterials,
		});

		this.props.crafting.craftingMaterials = craftingMaterials;
	};

	private onPreviousReset = () => {
		this.setState({
			previous: null,
			upgradeMaterials: [],
		});

		this.props.crafting.previous = null;
		this.props.crafting.upgradeMaterials = [];
	};

	private onPreviousSelect = (previous: Weapon) => {
		this.setState({
			previous,
		});

		this.props.crafting.previous = previous ? previous.id : null;
	};
}
