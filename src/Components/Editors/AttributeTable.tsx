import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {getAttributeDisplayName} from '../../Api/Model';
import {IAttribute} from './AttributeDropdowns';

export interface IAttributeTableProps {
	attributes: IAttribute[];

	attributeKeyColumnLabel?: string;
}

export const AttributeTable: React.FC<IAttributeTableProps> = props => (
	<Table
		columns={[
			{
				render: attribute => getAttributeDisplayName(attribute.key),
				title: props.attributeKeyColumnLabel,
			},
			{
				dataIndex: 'value',
				title: 'Value',
			},
		]}
		dataSource={props.attributes.filter(attribute => attribute.key.length > 0 && attribute.value)}
		fullWidth={true}
		noDataPlaceholder={<div style={{marginBottom: 10}}>This item has no attributes.</div>}
	/>
);

AttributeTable.defaultProps = {
	attributeKeyColumnLabel: 'Attribute',
};
