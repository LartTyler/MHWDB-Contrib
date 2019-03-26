import {FormGroup} from '@blueprintjs/core';
import {MultiSelect} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Coating} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

interface IProps extends IAttributeDialogProps<Coating[]> {
}

interface IState {
	values: Coating[];
}

export class CoatingsDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			values: props.value || [],
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Coatings">
				<FormGroup label="Coatings">
					<MultiSelect
						items={Object.values(Coating)}
						itemTextRenderer={this.renderCoatingText}
						onClear={this.onCoatingsClear}
						onItemDeselect={this.onCoatingDeselect}
						onItemSelect={this.onCoatingSelect}
						popoverProps={{
							targetClassName: 'full-width',
						}}
						selected={this.state.values}
					/>
				</FormGroup>
			</AttributeDialog>
		);
	}

	private renderCoatingText = (coating: Coating) => coating.split(' ').map(ucfirst).join(' ');

	private onCoatingsClear = () => this.setState({
		values: [],
	});

	private onCoatingDeselect = (target: Coating) => this.setState({
		values: this.state.values.filter(coating => coating !== target),
	});

	private onCoatingSelect = (coating: Coating) => this.setState({
		values: [...this.state.values, coating],
	});

	private save = () => this.props.onSave(this.props.attribute, this.state.values.sort());
}
