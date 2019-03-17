import {FormGroup, InputGroup} from '@blueprintjs/core';
import * as React from 'react';
import {cleanNumberString} from '../../../../Utility/number';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

export interface INumberDialogProps extends IAttributeDialogProps<number> {
	title: string;

	allowNegative?: boolean;
	label?: string;
}

interface IState {
	value: string;
}

export class NumberDialog extends React.PureComponent<INumberDialogProps, IState> {
	public static defaultProps: Partial<INumberDialogProps> = {
		allowNegative: false,
	};

	public constructor(props: INumberDialogProps) {
		super(props);

		this.state = {
			value: props.value ? props.value.toString(10) : '',
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title={this.props.title}>
				<FormGroup label={this.props.label || this.props.title} labelFor="value">
					<InputGroup name="value" onChange={this.onValueChange} value={this.state.value} />
				</FormGroup>
			</AttributeDialog>
		);
	}

	private onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		value: cleanNumberString(event.currentTarget.value, this.props.allowNegative),
	});

	private save = () => this.props.onSave(this.props.attribute, parseInt(this.state.value, 10));
}
