import {FormGroup, InputGroup} from '@blueprintjs/core';
import * as React from 'react';
import {cleanNumberString} from '../../../../Utility/number';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

interface IProps extends IAttributeDialogProps<string> {
}

interface IState {
	value: string;
}

export class AffinityDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			value: props.value,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Affinity">
				<FormGroup label="Affinity" labelFor="affinity">
					<InputGroup name="affinity" onChange={this.onAffinityChange} value={this.state.value} />
				</FormGroup>
			</AttributeDialog>
		);
	}

	private onAffinityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		value: cleanNumberString(event.currentTarget.value),
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.value);
}
