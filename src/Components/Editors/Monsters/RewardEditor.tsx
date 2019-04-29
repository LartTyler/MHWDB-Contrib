import {Button} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Item} from '../../../Api/Models/Item';
import {MonsterReward} from '../../../Api/Models/Monster';

interface IProps {
	items: Item[];
	onChange: (rewards: MonsterReward[]) => void;
	rewards: MonsterReward[];

	readOnly?: boolean;
}

export class RewardEditor extends React.PureComponent<IProps, {}> {
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
							render: reward => {
								const length = reward.conditions.length;

								return `${length} Condition${length !== 1 ? 's' : ''}`;
							},
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
				/>
			</>
		);
	}

	private onRewardDelete = (target: MonsterReward) => {
		this.props.onChange(this.props.rewards.filter(reward => reward !== target));
	};
}
