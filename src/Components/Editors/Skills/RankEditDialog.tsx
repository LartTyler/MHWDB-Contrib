import {Button, Classes, Dialog, FormGroup, InputGroup, Intent, TextArea} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {attributeNames, getAttributeDisplayName, IAttributes} from '../../../Api/Model';
import {SkillRank} from '../../../Api/Models/Skill';
import {filterStrings} from '../../../Utility/select';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

const numberRegex = /^-?\d*\.?\d+$/;

interface IModifier {
	key: string;
	value: string | number;
}

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (rank: SkillRank) => void;
	onSave: (rank: SkillRank) => void;

	rank?: SkillRank;
	readOnly?: boolean;
}

interface IState {
	description: string;
	modifiers: IModifier[];
	omitModifiers: string[];
}

export class RankEditDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		const rank = props.rank || {
			modifiers: {},
		};

		const modifierKeys = Object.keys(rank.modifiers);

		this.state = {
			description: rank.description || '',
			modifiers: modifierKeys.map(key => ({
				key,
				value: rank.modifiers[key],
			})),
			omitModifiers: modifierKeys,
		};
	}

	public render(): React.ReactNode {
		const readOnly = this.props.readOnly;

		return (
			<ThemeContext.Consumer>
				{theme => (
					<Dialog
						canEscapeKeyClose={true}
						canOutsideClickClose={true}
						className={theme === Theme.DARK ? Classes.DARK : ''}
						enforceFocus={true}
						isOpen={this.props.isOpen}
						onClose={this.props.onClose}
						title={this.props.rank ? `Edit Rank ${this.props.rank.level}` : 'Add Rank'}
					>
						<div className={Classes.DIALOG_BODY}>
							<form onSubmit={this.onSave}>
								<FormGroup label="Description" labelFor="description">
									<TextArea
										fill={true}
										name="description"
										onChange={this.onDescriptionChange}
										readOnly={readOnly}
										value={this.state.description}
									/>
								</FormGroup>

								{this.state.modifiers.map((modifier, index) => (
									<Row key={index}>
										<Cell size={5}>
											<FormGroup label="Modifier">
												<Select
													disabled={readOnly}
													itemListPredicate={filterStrings}
													items={attributeNames}
													itemTextRenderer={getAttributeDisplayName}
													omit={this.state.omitModifiers}
													onItemSelect={(key: string) => this.onModifierKeyChange(
														modifier,
														key,
													)}
													popoverProps={{
														targetClassName: 'full-width',
														usePortal: false,
													}}
													selected={modifier.key}
												/>
											</FormGroup>
										</Cell>

										<Cell size={5}>
											<FormGroup label="Value">
												<InputGroup
													onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
														this.onModifierValueChange(modifier, event.currentTarget.value);
													}}
													readOnly={readOnly}
													value={modifier.value.toString()}
												/>
											</FormGroup>
										</Cell>

										{!readOnly && (
											<Cell className="text-right" size={2}>
												<FormGroup label={<span>&nbsp;</span>}>
													<Button
														icon="cross"
														onClick={() => this.onModifierDelete(modifier)}
													/>
												</FormGroup>
											</Cell>
										)}
									</Row>
								))}

								{!readOnly && (
									<Button icon="plus" onClick={this.onModifierAdd}>
										Add Modifier
									</Button>
								)}
							</form>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button onClick={this.props.onClose}>
									Close
								</Button>

								{!readOnly && (
									<Button intent={Intent.PRIMARY} onClick={this.onSave}>
										Save
									</Button>
								)}
							</div>
						</div>
					</Dialog>
				)}
			</ThemeContext.Consumer>
		);
	}

	private onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onModifierAdd = () => this.setState({
		modifiers: [...this.state.modifiers, {key: '', value: ''}],
	});

	private onModifierDelete = (target: IModifier) => {
		const modifiers = this.state.modifiers.filter(modifier => modifier !== target);

		this.setState({
			modifiers,
			omitModifiers: modifiers.map(modifier => modifier.key),
		});
	};

	private onModifierKeyChange = (target: IModifier, key: string) => {
		target.key = key;

		this.setState({
			modifiers: [...this.state.modifiers],
			omitModifiers: this.state.modifiers.map(modifier => modifier.key),
		});
	};

	private onModifierValueChange = (modifier: IModifier, input: string) => {
		let value: string | number;

		if (numberRegex.test(input)) {
			if (input.indexOf('.') !== -1)
				value = parseFloat(input);
			else
				value = parseInt(input, 10);
		} else
			value = input;

		modifier.value = value;

		this.setState({
			modifiers: [...this.state.modifiers],
		});
	};

	private onSave = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		const rank = this.props.rank || {};

		rank.description = this.state.description;
		rank.modifiers = this.state.modifiers.reduce((modifiers, modifier) => {
			modifiers[modifier.key] = modifier.value;

			return modifiers;
		}, {} as IAttributes);

		if (this.props.rank)
			this.props.onSave(rank);
		else
			this.props.onCreate(rank);
	};
}
