import {Button, Classes, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {MonsterResistance} from '../../../Api/Models/Monster';
import {Element} from '../../../Api/Models/Weapon';
import {ucfirst} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	resistances: MonsterResistance[];
	onChange: (resistances: MonsterResistance[]) => void;
}

interface IState {
	activeResistance: MonsterResistance;
	condition: string;
	element: Element;
	showDialog: boolean;
}

export class MonsterResistancesEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeResistance: null,
		condition: '',
		element: null,
		showDialog: false,
	};

	public render(): React.ReactNode {
		return (
			<>
				<Table
					columns={[
						{
							render: resistance => ucfirst(resistance.element),
							style: {
								width: 100,
							},
							title: 'Element',
						},
						{
							render: resistance => resistance.condition || <span>&mdash;</span>,
							title: 'Condition',
						},
						{
							align: 'right',
							render: resistance => (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onEditClick(resistance)} />

									<Button
										icon="cross"
										minimal={true}
										onClick={() => this.onDeleteClick(resistance)}
									/>
								</>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.resistances}
					fullWidth={true}
					noDataPlaceholder={<div>This monster has no resistances.</div>}
					rowKey="element"
				/>

				<Button icon="plus" onClick={this.onAddClick} style={{marginTop: 15}}>
					Add Resistance
				</Button>

				<ThemeContext.Consumer>
					{theme => (
						<Dialog
							className={theme === Theme.DARK ? Classes.DARK : ''}
							isOpen={this.state.showDialog}
							onClose={this.onDialogClose}
							title={this.state.activeResistance ? 'Modify Resistance' : 'Add Resistance'}
						>
							<div className={Classes.DIALOG_BODY}>
								<FormGroup label="Element" labelFor="element">
									<Select
										filterable={false}
										items={Object.values(Element)}
										itemTextRenderer={this.renderElementText}
										onItemSelect={this.onElementSelect}
										popoverProps={{
											targetClassName: 'full-width',
										}}
										selected={this.state.element}
									/>
								</FormGroup>

								<FormGroup label="Condition" labelFor="condition">
									<InputGroup
										name="condition"
										onChange={this.onConditionChange}
										value={this.state.condition || ''}
									/>
								</FormGroup>
							</div>

							<div className={Classes.DIALOG_FOOTER}>
								<div className={Classes.DIALOG_FOOTER_ACTIONS}>
									<Button onClick={this.onDialogClose}>
										Cancel
									</Button>

									<Button
										disabled={this.state.element === null}
										intent={Intent.PRIMARY}
										onClick={this.onSave}
									>
										Save
									</Button>
								</div>
							</div>
						</Dialog>
					)}
				</ThemeContext.Consumer>
			</>
		);
	}

	private renderElementText = (element: Element) => ucfirst(element);

	private onAddClick = () => this.setState({
		showDialog: true,
	});

	private onConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		condition: event.currentTarget.value,
	});

	private onDeleteClick = (target: MonsterResistance) => {
		const resistances = this.props.resistances.filter(resistance => resistance !== target);

		this.props.onChange(resistances);
	};

	private onDialogClose = () => this.setState({
		activeResistance: null,
		condition: '',
		element: null,
		showDialog: false,
	});

	private onEditClick = (resistance: MonsterResistance) => this.setState({
		activeResistance: resistance,
		condition: resistance.condition,
		element: resistance.element,
		showDialog: true,
	});

	private onElementSelect = (element: Element) => this.setState({
		element,
	});

	private onSave = () => {
		const resistance = this.state.activeResistance || {};

		resistance.condition = this.state.condition.trim() || null;
		resistance.element = this.state.element;

		if (this.state.activeResistance)
			this.props.onChange([...this.props.resistances]);
		else
			this.props.onChange([...this.props.resistances, resistance]);

		this.onDialogClose();
	};
}
