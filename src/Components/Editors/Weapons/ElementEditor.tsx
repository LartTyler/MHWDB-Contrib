import {Button, Checkbox, Classes, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Element, WeaponElement} from '../../../Api/Models/Weapon';
import {cleanNumberString} from '../../../Utility/number';
import {ucfirst} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	elements: WeaponElement[];
	onElementAdd: (element: WeaponElement) => void;
	onElementChange: (element: WeaponElement) => void;
	onElementRemove: (target: WeaponElement) => void;

	readOnly?: boolean;
}

interface IState {
	activeElement: WeaponElement;
	damage: string;
	hidden: boolean;
	showDialog: boolean;
	type: Element;
}

export class ElementEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeElement: null,
		damage: '',
		hidden: false,
		showDialog: false,
		type: null,
	};

	public render(): React.ReactNode {
		return (
			<>
				<Table
					columns={[
						{
							render: element => ucfirst(element.type),
							title: 'Type',
						},
						{
							dataIndex: 'damage',
							title: 'Damage',
						},
						{
							align: 'center',
							render: element => element.hidden ? 'Yes' : 'No',
							style: {
								width: 80,
							},
							title: 'Hidden',
						},
						{
							align: 'right',
							render: element => !this.props.readOnly && (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onEditClick(element)} />

									<Button
										icon="cross"
										minimal={true}
										onClick={() => this.props.onElementRemove(element)}
									/>
								</>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.elements}
					fullWidth={true}
					noDataPlaceholder={<div>This weapon has no elements.</div>}
					rowKey="type"
				/>

				{!this.props.readOnly && (
					<>
						<Button icon="plus" onClick={this.onEditDialogShow} style={{marginTop: 15}}>
							Add Element
						</Button>

						<ThemeContext.Consumer>
							{theme => (
								<Dialog
									className={theme === Theme.DARK ? Classes.DARK : ''}
									isOpen={this.state.showDialog}
									onClose={this.onEditDialogClose}
									title="Modify Element"
								>
									<div className={Classes.DIALOG_BODY}>
										<FormGroup label="Element">
											<Select
												filterable={false}
												items={Object.values(Element)}
												itemTextRenderer={this.renderElementText}
												omit={this.props.elements.map(element => element.type)}
												onItemSelect={this.onElementSelect}
												popoverProps={{
													targetClassName: 'full-width',
												}}
												selected={this.state.type}
											/>
										</FormGroup>

										<Row>
											<Cell size={8}>
												<FormGroup label="Damage">
													<InputGroup
														name="damage"
														onChange={this.onDamageChange}
														value={this.state.damage}
													/>
												</FormGroup>
											</Cell>

											<Cell size={4}>
												<FormGroup label="Hidden">
													<Checkbox
														checked={this.state.hidden}
														name="hidden"
														onChange={this.onHiddenChange}
													>
														Yes
													</Checkbox>
												</FormGroup>
											</Cell>
										</Row>
									</div>

									<div className={Classes.DIALOG_FOOTER}>
										<div className={Classes.DIALOG_FOOTER_ACTIONS}>
											<Button onClick={this.onEditDialogClose}>
												Cancel
											</Button>

											<Button intent={Intent.PRIMARY} onClick={this.onEditDialogSave}>
												Save
											</Button>
										</div>
									</div>
								</Dialog>
							)}
						</ThemeContext.Consumer>
					</>
				)}
			</>
		);
	}

	private renderElementText = (element: Element) => ucfirst(element);

	private onDamageChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		damage: cleanNumberString(event.currentTarget.value, false),
	});

	private onEditClick = (element: WeaponElement) => this.setState({
		activeElement: element,
		damage: element.damage.toString(10),
		hidden: element.hidden,
		showDialog: true,
		type: element.type,
	});

	private onEditDialogClose = () => this.setState({
		activeElement: null,
		damage: '',
		hidden: false,
		showDialog: false,
		type: null,
	});

	private onEditDialogSave = () => {
		const element = this.state.activeElement || {};

		element.damage = parseInt(this.state.damage, 10);
		element.hidden = this.state.hidden;
		element.type = this.state.type;

		if (this.state.activeElement)
			this.props.onElementChange(element);
		else
			this.props.onElementAdd(element);

		this.onEditDialogClose();
	};

	private onEditDialogShow = () => this.setState({
		showDialog: true,
	});

	private onElementSelect = (type: Element) => this.setState({
		type,
	});

	private onHiddenChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		hidden: event.currentTarget.checked,
	});
}
