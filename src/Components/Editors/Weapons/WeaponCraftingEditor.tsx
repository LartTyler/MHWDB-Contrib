import {Button, ButtonGroup, Checkbox, Classes, FormGroup, H4} from '@blueprintjs/core';
import {Cell, MultiSelect, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {CraftingCost, Item, ItemModel} from '../../../Api/Models/Item';
import {Weapon, WeaponCrafting, WeaponModel, WeaponType} from '../../../Api/Models/Weapon';
import {CraftingCostTable} from '../../CraftingCostsTable';
import {CraftingCostDialog, itemSorter} from '../CraftingCostDialog';
import './WeaponCraftingEditor.scss';
import {weaponSorter} from './WeaponList';

interface IProps {
	crafting: WeaponCrafting;
	weaponId: number | string;
	weaponType: WeaponType;
}

interface IState {
	craftable: boolean;
	craftingCostDialogType: 'crafting' | 'upgrade';
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
			craftable: props.crafting.craftable || false,
			craftingCostDialogType: null,
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
			let previous: Weapon = null;

			for (const item of response.data) {
				// tslint:disable-next-line:triple-equals
				if (item.id == this.props.weaponId)
					continue;

				if (this.props.crafting.previous === item.id)
					previous = item;

				weapons.push(item);
			}

			this.setState({
				previous,
				weapons: weapons.sort(weaponSorter),
			});
		});

		ItemModel.list(null, {
			id: true,
			name: true,
		}).then(response => {
			const craftingMaterials: CraftingCost[] = [];
			const upgradeMaterials: CraftingCost[] = [];

			for (const item of response.data) {
				for (const cost of this.props.crafting.craftingMaterials) {
					if (cost.item.id === item.id) {
						craftingMaterials.push({
							item,
							quantity: cost.quantity,
						});

						break;
					}
				}

				for (const cost of this.props.crafting.upgradeMaterials) {
					if (cost.item.id === item.id) {
						upgradeMaterials.push({
							item,
							quantity: cost.quantity,
						});

						break;
					}
				}
			}

			this.setState({
				craftingMaterials,
				items: response.data.sort(itemSorter),
				upgradeMaterials,
			});
		});
	}

	public render(): React.ReactNode {
		return (
			<>
				<Row>
					<Cell size={6}>
						<FormGroup label="Craftable">
							<Checkbox checked={this.state.craftable} onChange={this.onCraftableChange}>
								Is Craftable
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

				<Row>
					{this.state.craftable && (
						<Cell size={this.state.previous !== null ? 6 : 12}>
							<H4>Crafting Costs</H4>

							<CraftingCostTable
								costs={this.state.craftingMaterials}
								loading={this.state.items === null}
								noDataPlaceholder={<div>Use the button below to add crafting material costs.</div>}
								onRemove={this.onCraftingCostRemove}
							/>

							<Button
								disabled={this.state.items === null}
								icon="plus"
								onClick={this.onCraftingCostAddClick}
								style={{marginTop: 10}}
							>
								Add Item
							</Button>
						</Cell>
					)}

					{this.state.previous !== null && (
						<Cell size={this.state.craftable ? 6 : 12}>
							<H4>Upgrade Costs</H4>

							<CraftingCostTable
								costs={this.state.upgradeMaterials}
								loading={this.state.items === null}
								noDataPlaceholder={<div>Use the button below to add upgrade material costs.</div>}
								onRemove={this.onUpgradeCostRemove}
							/>

							<Button
								disabled={this.state.items === null}
								icon="plus"
								onClick={this.onUpgradeCostAddClick}
								style={{marginTop: 10}}
							>
								Add Item
							</Button>
						</Cell>
					)}
				</Row>

				<CraftingCostDialog
					isOpen={this.state.craftingCostDialogType !== null}
					items={this.state.items}
					onClose={this.onCraftingCostDialogClose}
					onSubmit={this.onCraftingCostDialogSave}
				/>
			</>
		);
	}

	private renderWeaponText = (weapon: Weapon) => weapon.name;

	private filterWeaponList = (query: string, weapons: Weapon[]) => {
		query = query.toLowerCase();

		return weapons.filter(weapon => weapon.name.toLowerCase().indexOf(query) !== -1);
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

	private onCraftingCostAddClick = () => this.setState({
		craftingCostDialogType: 'crafting',
	});

	private onCraftingCostDialogClose = () => this.setState({
		craftingCostDialogType: null,
	});

	private onCraftingCostDialogSave = (cost: CraftingCost) => {
		if (this.state.craftingCostDialogType === 'crafting') {
			const craftingMaterials = [...this.state.craftingMaterials, cost];

			this.setState({
				craftingMaterials,
			});

			this.props.crafting.craftingMaterials = craftingMaterials;
		} else {
			const upgradeMaterials = [...this.state.upgradeMaterials, cost];

			this.setState({
				upgradeMaterials,
			});

			this.props.crafting.upgradeMaterials = upgradeMaterials;
		}

		this.onCraftingCostDialogClose();
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

	private onUpgradeCostAddClick = () => this.setState({
		craftingCostDialogType: 'upgrade',
	});

	private onUpgradeCostRemove = (target: CraftingCost) => {
		const upgradeMaterials = this.state.upgradeMaterials.filter(cost => cost !== target);

		this.setState({
			upgradeMaterials,
		});

		this.props.crafting.upgradeMaterials = upgradeMaterials;
	};
}
