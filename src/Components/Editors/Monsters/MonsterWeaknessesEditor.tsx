import {Button, Classes, Dialog, FormGroup, Icon, InputGroup, Intent} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {MonsterWeakness} from '../../../Api/Models/Monster';
import {Element} from '../../../Api/Models/Weapon';
import {range} from '../../../Utility/array';
import {ucfirst} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	weaknesses: MonsterWeakness[];
	onChange: (weaknesses: MonsterWeakness[]) => void;
}

interface IState {
	activeWeakness: MonsterWeakness;
	condition: string;
	element: Element;
	showDialog: boolean;
	stars: number;
}

export class MonsterWeaknessesEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeWeakness: null,
		condition: '',
		element: null,
		showDialog: false,
		stars: 1,
	};

	public render(): React.ReactNode {
		const elements = Object.values(Element);
		const omit = this.props.weaknesses.map(weakness => weakness.element);

		return (
			<>
				<Table
					columns={[
						{
							render: weakness => ucfirst(weakness.element),
							title: 'Element',
						},
						{
							render: weakness => weakness.condition || <span>&mdash;</span>,
							title: 'Condition',
						},
						{
							align: 'center',
							render: weakness => (
								<>
									<Icon icon="star" />
									<Icon icon={weakness.stars >= 2 ? 'star' : 'star-empty'} />
									<Icon icon={weakness.stars >= 3 ? 'star' : 'star-empty'} />
								</>
							),
							style: {
								width: 75,
							},
							title: 'Stars',
						},
						{
							align: 'right',
							render: weakness => (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onEditClick(weakness)} />
									<Button icon="cross" minimal={true} onClick={() => this.onDeleteClick(weakness)} />
								</>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.weaknesses}
					fullWidth={true}
					noDataPlaceholder={<div>This monster has no weaknesses.</div>}
					rowKey="element"
				/>

				<Button
					disabled={omit.length === elements.length}
					icon="plus"
					onClick={this.onAddClick}
					style={{marginTop: 15}}
				>
					Add Weakness
				</Button>

				<ThemeContext.Consumer>
					{theme => (
						<Dialog
							className={theme === Theme.DARK ? Classes.DARK : ''}
							isOpen={this.state.showDialog}
							onClose={this.onDialogClose}
							title={this.state.activeWeakness ? 'Edit Weakness' : 'Add Weakness'}
						>
							<div className={Classes.DIALOG_BODY}>
								<FormGroup label="Element">
									<Select
										filterable={false}
										items={elements}
										itemTextRenderer={this.renderElementText}
										omit={omit}
										onItemSelect={this.onElementSelect}
										popoverProps={{
											targetClassName: 'full-width',
										}}
										selected={this.state.element}
									/>
								</FormGroup>

								<FormGroup label="Stars">
									<Select
										filterable={false}
										items={range(1, 3)}
										onItemSelect={this.onStarsSelect}
										popoverProps={{
											targetClassName: 'full-width',
										}}
										selected={this.state.stars}
									/>
								</FormGroup>

								<FormGroup label="Condition" labelFor="condition">
									<InputGroup
										name="condition"
										onChange={this.onConditionChange}
										value={this.state.condition}
									/>
								</FormGroup>
							</div>

							<div className={Classes.DIALOG_FOOTER}>
								<div className={Classes.DIALOG_FOOTER_ACTIONS}>
									<Button onClick={this.onDialogClose}>
										Cancel
									</Button>

									<Button intent={Intent.PRIMARY} onClick={this.onSave}>
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

	private onDeleteClick = (target: MonsterWeakness) => {
		const weaknesses = this.props.weaknesses.filter(weakness => weakness !== target);

		this.props.onChange(weaknesses);
	};

	private onDialogClose = () => this.setState({
		activeWeakness: null,
		condition: '',
		element: null,
		showDialog: false,
		stars: 1,
	});

	private onEditClick = (weakness: MonsterWeakness) => this.setState({
		activeWeakness: weakness,
		condition: weakness.condition,
		element: weakness.element,
		showDialog: true,
		stars: weakness.stars,
	});

	private onElementSelect = (element: Element) => this.setState({
		element,
	});

	private onStarsSelect = (stars: number) => this.setState({
		stars,
	});

	private onSave = () => {
		const weakness = this.state.activeWeakness || {};

		weakness.condition = this.state.condition.trim();
		weakness.element = this.state.element;
		weakness.stars = this.state.stars;

		if (this.state.activeWeakness)
			this.props.onChange([...this.props.weaknesses]);
		else
			this.props.onChange([...this.props.weaknesses, weakness]);

		this.onDialogClose();
	};
}
