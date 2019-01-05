import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {getDisplayName} from '../../Api/Objects/attributes';
import {IAttribute} from './AttributeDropdowns';

export interface IAttributeTableProps {
	attributes: IAttribute[];

	attributeKeyColumnLabel?: string;
}

export const AttributeTable: React.FC<IAttributeTableProps> = props => (
	<Table
		columns={[
			{
				render: attribute => getDisplayName(attribute.key),
				title: props.attributeKeyColumnLabel,
			},
			{
				dataIndex: 'value',
				title: 'Value',
			},
		]}
		dataSource={props.attributes.filter(attribute => attribute.key.length > 0)}
		fullWidth={true}
		noDataPlaceholder={<div style={{marginBottom: 10}}>This item has no attributes.</div>}
	/>
);

AttributeTable.defaultProps = {
	attributeKeyColumnLabel: 'Attribute',
};
