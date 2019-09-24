import {Button, Classes, FormGroup, InputGroup, Intent, PopoverPosition} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {AmmoCapacity, ammoLevels, AmmoType} from '../../../Api/Models/Weapons/ammo';
import {cleanNumberString} from '../../../Utility/number';
import {filterStrings} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {Dialog} from '../../Dialog';

const sortedAmmoTypes = Object.values(AmmoType).sort();

interface IProps {
	ammo: AmmoCapacity[];
	onChange: (ammo: AmmoCapacity[]) => void;
	readOnly: boolean;
}

interface IState {
	currentAmmoType: AmmoType;
	currentCapacities: string[];
	showDialog: boolean;
}

export class AmmoCapacityEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		currentAmmoType: null,
		currentCapacities: [],
		showDialog: false,
	};

	public render(): React.ReactNode {
		const dialogItems: React.ReactNode[] = [];

		if (this.state.showDialog) {
			for (let i = 0, ii = ammoLevels[this.state.currentAmmoType]; i < ii; i++) {
				dialogItems.push((
					<Cell key={`${this.state.currentAmmoType}.${i}`} size={4}>
						<FormGroup label={`Level ${i + 1}`}>
							<InputGroup
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									this.onLevelInputChange(event, i);
								}}
								placeholder="0"
								value={this.state.currentCapacities[i]}
							/>
						</FormGroup>
					</Cell>
				));
			}
		}

		return (
			<>
				<Table
					columns={[
						{
							render: (record: AmmoCapacity) => ucfirst(record.type),
							title: 'Ammo Type',
						},
						{
							render: (record: AmmoCapacity) => record.capacities.join(', '),
							title: 'Ammo Capacity',
						},
						{
							align: 'right',
							render: (record: AmmoCapacity) => !this.props.readOnly && (
								<>
									<Button
										icon="edit"
										minimal={true}
										onClick={() => this.onCapacityEditClick(record)}
									/>

									<Button
										icon="cross"
										minimal={true}
										onClick={() => this.onCapacityDeleteClick(record)}
									/>
								</>
							),
							title: '',
						},
					]}
					dataSource={this.props.ammo}
					noDataPlaceholder={(
						<div style={{marginBottom: 10}}>
							This bowgun has no set ammo capacities. Use the button below to add some.
						</div>
					)}
					rowKey="type"
					fullWidth={true}
				/>

				{!this.props.readOnly && (
					<>
						<Select
							buttonProps={{
								icon: 'plus',
							}}
							itemListPredicate={filterStrings}
							items={sortedAmmoTypes}
							itemTextRenderer={ucfirst}
							noItemSelected="Add Ammo Capacity"
							omit={this.props.ammo.map(item => item.type)}
							onItemSelect={this.onAddAmmoCapacitySelect}
							popoverProps={{
								position: PopoverPosition.TOP,
							}}
						/>

						<Dialog
							isOpen={this.state.showDialog}
							onClose={this.onDialogClose}
							title={this.state.currentAmmoType && `Modify ${ucfirst(this.state.currentAmmoType)} Ammo Capacity`}
						>
							<div className={Classes.DIALOG_BODY}>
								<form onSubmit={this.onDialogSave}>
									<Row>
										{dialogItems}
									</Row>
								</form>
							</div>

							<div className={Classes.DIALOG_FOOTER}>
								<div className={Classes.DIALOG_FOOTER_ACTIONS}>
									<Button onClick={this.onDialogClose} text="Cancel" />

									<Button intent={Intent.PRIMARY} onClick={this.onDialogSave} text="Save" />
								</div>
							</div>
						</Dialog>
					</>
				)}
			</>
		);
	}

	private onAddAmmoCapacitySelect = (type: AmmoType) => this.setState({
		currentAmmoType: type,
		currentCapacities: (new Array(ammoLevels[type])).fill(0),
		showDialog: true,
	});

	private onCapacityDeleteClick = (target: AmmoCapacity) => {
		const ammo = this.props.ammo.filter(item => item !== target);

		this.props.onChange(ammo);
	};

	private onCapacityEditClick = (item: AmmoCapacity) => this.setState({
		currentAmmoType: item.type,
		currentCapacities: item.capacities.map(amount => amount.toString(10)),
		showDialog: true,
	});

	private onDialogClose = () => this.setState({
		showDialog: false,
	});

	private onDialogSave = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		const ammo = this.props.ammo.filter(item => item.type !== this.state.currentAmmoType);
		ammo.push({
			capacities: this.state.currentCapacities.map(amount => {
				if (!amount)
					return 0;

				return parseInt(amount, 10);
			}),
			type: this.state.currentAmmoType,
		} as AmmoCapacity);

		this.props.onChange(ammo);

		this.setState({
			showDialog: false,
		});
	};

	private onLevelInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const capacities = [...this.state.currentCapacities];
		capacities[index] = cleanNumberString(event.currentTarget.value, false);

		this.setState({
			currentCapacities: capacities,
		});
	};
}
