import {Button, Classes, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Rank} from '../../../Api/Model';
import {RewardCondition, RewardConditionType} from '../../../Api/Models/Reward';
import {cleanNumberString} from '../../../Utility/number';
import {ucfirst, ucwords} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (condition: RewardCondition) => void;
}

interface IState {
	chance: string;
	quantity: string;
	rank: Rank;
	subtype: string;
	type: RewardConditionType;
}

export class RewardConditionDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		chance: '',
		quantity: '',
		rank: null,
		subtype: '',
		type: null,
	};

	public render(): React.ReactNode {
		return (
			<ThemeContext.Consumer>
				{theme => (
					<Dialog
						className={theme === Theme.DARK ? Classes.DARK : ''}
						isOpen={this.props.isOpen}
						onClose={this.props.onClose}
						title="Add Reward Condition"
					>
						<div className={Classes.DIALOG_BODY}>
							<form onSubmit={this.onSave}>
								<FormGroup label="Rank" labelFor="rank">
									<Select
										filterable={false}
										items={Object.values(Rank)}
										itemTextRenderer={ucfirst}
										onItemSelect={this.onRankSelect}
										popoverProps={{
											targetClassName: 'full-width',
										}}
										selected={this.state.rank}
									/>
								</FormGroup>

								<FormGroup label="Type" labelFor="type">
									<Select
										filterable={false}
										items={Object.values(RewardConditionType)}
										itemTextRenderer={ucwords}
										onItemSelect={this.onTypeSelect}
										popoverProps={{
											targetClassName: 'full-width',
										}}
										selected={this.state.type}
									/>
								</FormGroup>

								<FormGroup label="Subtype" labelFor="subtype">
									<InputGroup
										name="subtype"
										onChange={this.onSubtypeChange}
										value={this.state.subtype}
									/>
								</FormGroup>

								<FormGroup
									helperText="Enter drop chance as a percentage (whole numbers only)"
									label="Drop Chance"
									labelFor="chance"
								>
									<InputGroup
										name="chance"
										onChange={this.onChanceChange}
										value={this.state.chance}
										rightElement={<Button icon="percentage" minimal={true} />}
									/>
								</FormGroup>

								<FormGroup label="Quantity" labelFor="quantity">
									<InputGroup
										name="quantity"
										onChange={this.onQuantityChange}
										value={this.state.quantity}
									/>
								</FormGroup>
							</form>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button onClick={this.props.onClose}>
									Cancel
								</Button>

								<Button
									disabled={!this.isDialogComplete()}
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
		);
	}

	private onChanceChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		chance: cleanNumberString(event.currentTarget.value, false),
	});

	private onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		quantity: cleanNumberString(event.currentTarget.value, false),
	});

	private onRankSelect = (rank: Rank) => this.setState({
		rank,
	});

	private onSubtypeChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		subtype: event.currentTarget.value,
	});

	private onTypeSelect = (type: RewardConditionType) => this.setState({
		type,
	});

	private onSave = (event: React.SyntheticEvent<any>) => {
		event.preventDefault();

		const condition: RewardCondition = {
			chance: parseInt(this.state.chance, 10),
			quantity: parseInt(this.state.quantity, 10),
			rank: this.state.rank,
			subtype: this.state.subtype.trim() || null,
			type: this.state.type,
		};

		this.props.onSave(condition);

		this.setState({
			chance: '',
			quantity: '',
			rank: null,
			subtype: '',
			type: null,
		});
	};

	private isDialogComplete = () => this.state.type && this.state.quantity && this.state.rank && this.state.chance;
}
