import {Button, Classes, Menu, MenuDivider, MenuItem, Popover} from '@blueprintjs/core';
import {Select, Table, Row, Cell} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Item} from '../../../Api/Models/Item';
import {MonsterReward} from '../../../Api/Models/Monster';
import {RewardCondition} from '../../../Api/Models/Reward';
import {ucfirst, ucwords} from '../../../Utility/string';
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
		const omit = this.props.rewards.map(reward => reward.item);

		return (
			<>
				<Table
					columns={[
						{
							render: reward => reward.item.name || '???',
							title: 'Item',
						},
						{
							render: this.renderConditionsPopover,
							title: 'Conditions',
						},
						{
							align: 'right',
							render: reward => !this.props.readOnly && (
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

				{!this.props.readOnly && (
					<>
						<div style={{marginTop: 15}}>
							<Select
								buttonProps={{
									icon: 'plus',
								}}
								itemKey="id"
								itemListPredicate={this.onItemsFilter}
								items={this.props.items || []}
								itemTextRenderer={this.renderItemText}
								loading={this.props.items === null}
								noItemSelected="Add Reward"
								omit={omit}
								onItemSelect={this.onRewardAdd}
								virtual={true}
							/>
						</div>

						<RewardConditionDialog
							isOpen={this.state.showConditionDialog}
							onClose={this.onConditionDialogClose}
							onSave={this.onConditionSave}
						/>
					</>
				)}
			</>
		);
	}

	private renderItemText = (item: Item) => item.name || '???';

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
						let text = `${ucfirst(condition.rank)} Rank ${ucwords(condition.type)}`;

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
								text={`${text} - ${condition.quantity}x @ ${condition.chance}%`}
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

	private onConditionSave = (condition: RewardCondition) => {
		this.state.activeReward.conditions.push(condition);

		this.props.onChange([...this.props.rewards]);

		this.setState({
			activeReward: null,
			showConditionDialog: false,
		});
	};

	private onConditionDialogClose = () => this.setState({
		activeReward: null,
		showConditionDialog: false,
	});

	private onItemsFilter = (query: string, items: Item[]) => {
		if (!query)
			return items;

		query = query.toLowerCase();

		return items.filter(item => item.name && item.name.toLowerCase().indexOf(query) !== -1);
	};

	private onRewardAdd = (item: Item) => {
		const reward: MonsterReward = {
			conditions: [],
			item,
		};

		this.props.onChange([
			...this.props.rewards,
			reward,
		]);

		this.setState({
			activeReward: reward,
			showConditionDialog: true,
		});
	};

	private onRewardDelete = (target: MonsterReward) => {
		this.props.onChange(this.props.rewards.filter(reward => reward !== target));
	};
}
