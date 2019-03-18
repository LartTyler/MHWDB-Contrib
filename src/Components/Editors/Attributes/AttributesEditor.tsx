import {Button, Menu, MenuItem, Popover} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {attributeLabels, AttributeName, IAttribute} from '../../../Api/Models/attributes';
import {dialogs, isAttributeValueRenderer} from './Dialogs/dialogs';

export interface IAttributeDialogProps<T> {
	attribute: AttributeName;
	onClose: () => void;
	onSave: (attribute: AttributeName, value: T) => void;
	value: T;
}

interface IProps {
	accepted: AttributeName[];
	attributes: IAttribute[];
	onChange: (attributes: IAttribute[]) => void;
}

interface IState {
	attribute: AttributeName;
	attributeValue: any;
	selectableAttributes: AttributeName[];
}

export class AttributesEditor extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		const omit = props.attributes.map(attribute => attribute.key);

		this.state = {
			attribute: null,
			attributeValue: null,
			selectableAttributes: props.accepted.filter(attribute => omit.indexOf(attribute) === -1).sort(),
		};
	}

	public render(): React.ReactNode {
		const AttributeDialog = this.state.attribute && dialogs[this.state.attribute];

		return (
			<>
				<Table
					columns={[
						{
							render: attribute => attributeLabels[attribute.key],
							title: 'Name',
						},
						{
							render: attribute => {
								const dialog = dialogs[attribute.key];

								if (isAttributeValueRenderer(dialog))
									return dialog.renderAttributeValue(attribute);
								else if (typeof attribute.value !== 'object')
									return attribute.value;

								return <span>&mdash;</span>;
							},
							title: 'Value',
						},
						{
							align: 'right',
							render: attribute => (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onEditClick(attribute)} />

									<Button icon="cross" minimal={true} onClick={() => this.onDeleteClick(attribute)} />
								</>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.attributes}
					fullWidth={true}
					noDataPlaceholder={<div>This item has no special attributes.</div>}
				/>

				<Popover>
					<Button disabled={this.state.selectableAttributes.length === 0} icon="plus" style={{marginTop: 10}}>
						Add Attribute
					</Button>

					<Menu>
						{this.state.selectableAttributes.map(attribute => (
							<MenuItem
								key={attribute}
								text={attributeLabels[attribute]}
								onClick={() => this.onAttributeSelect(attribute)}
							/>
						))}
					</Menu>
				</Popover>

				{!!AttributeDialog && (
					<AttributeDialog
						attribute={this.state.attribute}
						onClose={this.onDialogClose}
						onSave={this.onDialogSave}
						value={this.state.attributeValue}
					/>
				)}
			</>
		);
	}

	private onDeleteClick = (target: IAttribute) => {
		this.props.onChange(this.props.attributes.filter(attribute => attribute !== target));

		this.setState({
			selectableAttributes: [...this.state.selectableAttributes, target.key].sort(),
		});
	};

	private onEditClick = (attribute: IAttribute) => this.setState({
		attribute: attribute.key,
		attributeValue: attribute.value,
	});

	private onAttributeSelect = (attribute: AttributeName) => this.setState({
		attribute,
	});

	private onDialogClose = () => this.setState({
		attribute: null,
		attributeValue: null,
	});

	private onDialogSave = (attribute: AttributeName, value: any) => {
		const matched = this.props.attributes.find(item => item.key === attribute);

		if (matched) {
			matched.value = value;

			this.props.onChange([...this.props.attributes]);
		} else {
			this.props.onChange([
				...this.props.attributes,
				{
					key: attribute,
					value,
				},
			]);

			this.setState({
				selectableAttributes: this.state.selectableAttributes.filter(item => item !== attribute),
			});
		}

		this.onDialogClose();
	};
}
