import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Deviation} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

const deviations: Deviation[] = [
	Deviation.NONE,
	Deviation.LOW,
	Deviation.AVERAGE,
	Deviation.HIGH,
];

interface IProps extends IAttributeDialogProps<Deviation> {
}

interface IState {
	value: Deviation;
}

export class DeviationDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Deviation">
				<FormGroup label="Deviation" labelFor="deviation">
					<Select
						filterable={false}
						items={deviations}
						itemTextRenderer={this.renderItemText}
						selected={this.state.value}
						onItemSelect={this.onDeviationSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderItemText = (deviation: Deviation) => ucfirst(deviation);

	private onDeviationSelect = (deviation: Deviation) => this.setState({
		value: deviation,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
