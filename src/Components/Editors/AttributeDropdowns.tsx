import {Button, FormGroup, InputGroup} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {getDisplayName} from '../../Api/Objects/attributes';
import {numberRegex} from '../../Utility/number';
import {filterStrings} from '../../Utility/select';

export const toAttributes = (object: {[key: string]: string | number}): IAttribute[] => {
	return Object.keys(object).map(key => ({
		key,
		value: object[key],
	}));
};

export interface IAttribute {
	key: string;
	value: string | number;
}

export interface IAttributeDropdownsProps {
	attributes: IAttribute[];
	attributeNames: string[];
	onAttributeAdd: () => void;
	onAttributeDelete: (attribute: IAttribute) => void;
	onAttributeKeyChange: (attribute: IAttribute, newKey: string) => void;
	onAttributeValueChange: (attribute: IAttribute, newValue: string | number) => void;

	addButtonLabel?: string;
	attributeColumnLabel?: string;
}

export const AttributeDropdowns: React.FC<IAttributeDropdownsProps> = props => {
	const omit = props.attributes.map(attribute => attribute.key);

	return (
		<>
			{props.attributes.map((attribute, index) => (
				<Row key={index}>
					<Cell size={5}>
						<FormGroup label={props.attributeColumnLabel}>
							<Select
								itemListPredicate={filterStrings}
								items={props.attributeNames}
								itemTextRenderer={getDisplayName}
								omit={omit}
								onItemSelect={(key: string) => props.onAttributeKeyChange(attribute, key)}
								popoverProps={{
									targetClassName: 'full-width',
								}}
								selected={attribute.key}
							/>
						</FormGroup>
					</Cell>

					<Cell size={5}>
						<FormGroup label="Value">
							<InputGroup
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									let value: string | number = event.currentTarget.value;

									if (numberRegex.test(value)) {
										if (value.indexOf('.') !== -1)
											value = parseFloat(value);
										else
											value = parseInt(value, 10);
									}

									props.onAttributeValueChange(attribute, value);
								}}
								value={attribute.value.toString()}
							/>
						</FormGroup>
					</Cell>

					<Cell className="text-right" size={2}>
						<FormGroup label={<span>&nbsp;</span>}>
							<Button icon="cross" onClick={() => props.onAttributeDelete(attribute)} />
						</FormGroup>
					</Cell>
				</Row>
			))}

			<Button icon="plus" onClick={props.onAttributeAdd}>
				{props.addButtonLabel}
			</Button>
		</>
	);
};

AttributeDropdowns.defaultProps = {
	addButtonLabel: 'Add Attribute',
	attributeColumnLabel: 'Attribute',
};
