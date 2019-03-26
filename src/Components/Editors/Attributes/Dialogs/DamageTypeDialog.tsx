import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {DamageType} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

interface IProps extends IAttributeDialogProps<DamageType> {
}

interface IState {
	value: DamageType;
}

export class DamageTypeDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Damage Type">
				<FormGroup label="Damage Type">
					<Select
						filterable={false}
						items={Object.values(DamageType)}
						itemTextRenderer={this.renderDamageTypeText}
						onItemSelect={this.onDamageTypeSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
						selected={this.state.value}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderDamageTypeText = (damageType: DamageType) => ucfirst(damageType);

	private onDamageTypeSelect = (damageType: DamageType) => this.setState({
		value: damageType,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
