import {Button, Classes, Dialog, FormGroup, InputGroup, Intent, TextArea} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {getDisplayName} from '../../../_Api/Objects/attributes';
import {ISkillRank, ISkillRankModifiers, skillAttributeNames} from '../../../_Api/Objects/Skill';
import {filterStrings} from '../../../Utility/select';
import {IThemeAware, Theme, withThemeContext} from '../../Contexts/ThemeContext';

const numberRegex = /^-?\d*\.?\d+$/;

interface IModifier {
	key: string;
	value: string | number;
}

interface IProps extends IThemeAware {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (rank: ISkillRank) => void;
	onSave: (rank: ISkillRank) => void;

	rank?: ISkillRank;
}

interface IState {
	description: string;
	modifiers: IModifier[];
	omitModifiers: string[];
}

class RankEditDialogComponent extends React.PureComponent<IProps, IState> {
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
		return (
			<Dialog
				canEscapeKeyClose={true}
				canOutsideClickClose={true}
				className={this.props.theme === Theme.DARK ? Classes.DARK : ''}
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
								value={this.state.description}
							/>
						</FormGroup>

						{this.state.modifiers.map((modifier, index) => (
							<Row key={index}>
								<Cell size={5}>
									<FormGroup label="Modifier">
										<Select
											itemListPredicate={filterStrings}
											items={skillAttributeNames}
											itemTextRenderer={getDisplayName}
											omit={this.state.omitModifiers}
											onItemSelect={(key: string) => this.onModifierKeyChange(modifier, key)}
											popoverProps={{
												targetClassName: 'full-width',
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
											value={modifier.value.toString()}
										/>
									</FormGroup>
								</Cell>

								<Cell className="text-right" size={2}>
									<FormGroup label={<span>&nbsp;</span>}>
										<Button icon="cross" onClick={() => this.onModifierDelete(modifier)} />
									</FormGroup>
								</Cell>
							</Row>
						))}

						<Button icon="plus" onClick={this.onModifierAdd}>
							Add Modifier
						</Button>
					</form>
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={this.props.onClose}>
							Cancel
						</Button>

						<Button intent={Intent.PRIMARY} onClick={this.onSave}>
							Save
						</Button>
					</div>
				</div>
			</Dialog>
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
		}, {} as ISkillRankModifiers);

		if (this.props.rank)
			this.props.onSave(rank);
		else
			this.props.onCreate(rank);
	};
}

export const RankEditDialog = withThemeContext(RankEditDialogComponent);
