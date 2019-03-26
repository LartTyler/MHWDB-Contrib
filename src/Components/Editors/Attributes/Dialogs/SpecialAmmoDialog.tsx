import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {SpecialAmmo} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

interface IProps extends IAttributeDialogProps<SpecialAmmo> {
}

interface IState {
	value: SpecialAmmo;
}

export class SpecialAmmoDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Special Ammo">
				<FormGroup label="Special Ammo">
					<Select
						filterable={false}
						items={Object.values(SpecialAmmo)}
						itemTextRenderer={this.renderSpecialAmmoText}
						onItemSelect={this.onSpecialAmmoSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
						selected={this.state.value}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderSpecialAmmoText = (specialAmmo: SpecialAmmo) => ucfirst(specialAmmo);

	private onSpecialAmmoSelect = (specialAmmo: SpecialAmmo) => this.setState({
		value: specialAmmo,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
