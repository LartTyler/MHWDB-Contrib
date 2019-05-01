import {Button, Classes, Dialog, FormGroup, Intent, Menu, MenuDivider, MenuItem, Popover} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Item} from '../../../Api/Models/Item';
import {MonsterReward} from '../../../Api/Models/Monster';
import {RewardCondition, RewardConditionType} from '../../../Api/Models/Reward';
import {ucwords} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';
import {RewardConditionDialog} from './RewardConditionDialog';

interface IProps {
	items: Item[];
	onChange: (rewards: MonsterReward[]) => void;
	rewards: MonsterReward[];

	readOnly?: boolean;
}

interface IState {
	activeReward: MonsterReward;
	showConditionDialog: boolean;
}

export class RewardEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeReward: null,
		showConditionDialog: false,
	};

	public render(): React.ReactNode {
		return (
			<>
				<Table
					columns={[
						{
							render: reward => reward.item.name,
							title: 'Item',
						},
						{
							render: this.renderConditionsPopover,
							title: 'Conditions',
						},
						{
							align: 'right',
							render: reward => (
								<>
									<Button icon="cross" minimal={true} onClick={() => this.onRewardDelete(reward)} />
								</>
							),
							title: '',
						},
					]}
					dataSource={this.props.rewards}
					fullWidth={true}
					noDataPlaceholder={<div>This monster has no rewards.</div>}
					rowKey={record => record.item.id.toString(10)}
				/>
			</>
		);
	}

	private renderConditionsPopover = (reward: MonsterReward) => {
		return (
			<Popover>
				<Button minimal={true}>
					{reward.conditions.length} Condition{reward.conditions.length !== 1 ? 's' : ''}
				</Button>

				<Menu>
					{!this.props.readOnly && (
						<>
							<MenuItem
								icon="plus"
								text="Add Condition"
								onClick={() => this.onAddConditionClick(reward)}
							/>

							<MenuDivider />
						</>
					)}

					{reward.conditions.length > 0 && reward.conditions.map((condition, index) => {
						let text = ucwords(condition.type);

						if (condition.subtype)
							text += ` (${ucwords(condition.subtype)})`;

						return (
							<MenuItem
								key={index}
								labelElement={!this.props.readOnly && (
									<Button
										className={Classes.POPOVER_DISMISS_OVERRIDE}
										icon="cross"
										minimal={true}
										onClick={() => this.onConditionDelete(reward, condition)}
										small={true}
									/>
								)}
								text={text}
							/>
						);
					}) || (
						<MenuItem disabled={true} text="No reward conditions yet." />
					)}
				</Menu>
			</Popover>
		);
	};

	private onAddConditionClick = (activeReward: MonsterReward) => this.setState({
		activeReward,
		showConditionDialog: true,
	});

	private onConditionDelete = (reward: MonsterReward, target: RewardCondition) => {
		reward.conditions = reward.conditions.filter(condition => condition !== target);

		this.props.onChange([...this.props.rewards]);
	};

	private onConditionSave = () => {
		this.props.onChange([...this.props.rewards]);
	};

	private onConditionDialogClose = () => this.setState({
		activeReward: null,
		showConditionDialog: false,
	});

	private onRewardDelete = (target: MonsterReward) => {
		this.props.onChange(this.props.rewards.filter(reward => reward !== target));
	};
}
