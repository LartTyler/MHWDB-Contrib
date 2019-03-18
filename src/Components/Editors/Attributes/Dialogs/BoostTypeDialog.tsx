import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {BoostType} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

const boostTypes = Object.values(BoostType).sort();

interface IProps extends IAttributeDialogProps<BoostType> {
}

interface IState {
	value: BoostType;
}

export class BoostTypeDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Boost Type">
				<FormGroup label="Boost Type" labelFor="boostType">
					<Select
						filterable={false}
						items={boostTypes}
						itemTextRenderer={this.renderBoostTypeText}
						onItemSelect={this.onBoostTypeSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
						selected={this.state.value}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderBoostTypeText = (type: BoostType) => ucfirst(type);

	private onBoostTypeSelect = (value: BoostType) => this.setState({
		value,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
