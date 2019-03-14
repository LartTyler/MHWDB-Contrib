import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Gender} from '../../../Api/Models/Armor';
import {AttributeName} from '../../../Api/Models/attributes';
import {ucfirst} from '../../../Utility/string';
import {AttributeDialog} from './AttributeDialog';
import {IAttributeDialogProps} from './AttributesEditor';

interface IProps extends IAttributeDialogProps<Gender> {
}

interface IState {
	value: Gender;
}

export class RequiredGenderDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Required Gender">
				<FormGroup label="Gender" labelFor={AttributeName.GENDER}>
					<Select
						filterable={false}
						items={Object.values(Gender)}
						itemTextRenderer={this.renderItemText}
						selected={this.state.value}
						onItemSelect={this.onGenderSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderItemText = (gender: Gender) => ucfirst(gender);

	private onGenderSelect = (gender: Gender) => this.setState({
		value: gender,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
