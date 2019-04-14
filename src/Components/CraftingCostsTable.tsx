import {Button} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {CraftingCost} from '../Api/Models/Item';

interface IProps {
	costs: CraftingCost[];
	onRemove: (cost: CraftingCost) => void;

	loading?: boolean;
	noDataPlaceholder?: React.ReactNode;
	readOnly?: boolean;
}

export const CraftingCostTable: React.FC<IProps> = props => (
	<Table
		columns={[
			{
				render: cost => cost.item.name,
				title: 'Name',
			},
			{
				align: 'center',
				dataIndex: 'quantity',
				style: {
					width: 100,
				},
				title: 'Quantity',
			},
			{
				align: 'right',
				render: cost => !props.readOnly && (
					<Button
						icon="cross"
						minimal={true}
						onClick={() => props.onRemove(cost)}
					/>
				),
				title: <span>&nbsp;</span>,
			},
		]}
		dataSource={props.costs}
		fullWidth={true}
		loading={props.loading}
		noDataPlaceholder={props.noDataPlaceholder || <div>This item has no crafting costs.</div>}
		rowKey={cost => cost.item.id.toString(10)}
	/>
);
