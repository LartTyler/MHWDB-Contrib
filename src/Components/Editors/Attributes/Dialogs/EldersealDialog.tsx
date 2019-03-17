import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Elderseal} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

const elderseals = [
	Elderseal.LOW,
	Elderseal.AVERAGE,
	Elderseal.HIGH,
];

interface IProps extends IAttributeDialogProps<Elderseal> {
}

interface IState {
	value: Elderseal;
}

export class EldersealDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Elderseal">
				<FormGroup label="Elderseal" labelFor="elderseal">
					<Select
						filterable={false}
						items={elderseals}
						itemTextRenderer={this.renderItemText}
						selected={this.state.value}
						onItemSelect={this.onEldersealSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderItemText = (elderseal: Elderseal) => ucfirst(elderseal);

	private onEldersealSelect = (elderseal: Elderseal) => this.setState({
		value: elderseal,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
