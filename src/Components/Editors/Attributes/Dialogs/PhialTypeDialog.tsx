import {FormGroup, InputGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {DamagePhialType, PhialType} from '../../../../Api/Models/Weapon';
import {cleanNumberString} from '../../../../Utility/number';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

const damagePhialTypes = Object.values(DamagePhialType);
const allPhialTypes = Object.values(PhialType).concat(damagePhialTypes).sort();

type PhialTypes = PhialType | DamagePhialType;

interface IProps extends IAttributeDialogProps<string> {
}

interface IState {
	damage: string;
	type: PhialTypes;
}

export class PhialTypeDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		const parts = props.value.match(/^([a-zA-Z ]+)(\d+)$/);

		this.state = {
			damage: parts[2] || null,
			type: parts[1] as PhialTypes,
		};
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Phial Type">
				<>
					<FormGroup label="Phial Type" labelFor="phialType">
						<Select
							filterable={false}
							items={allPhialTypes}
							itemTextRenderer={this.renderPhialTypeText}
							onItemSelect={this.onPhialTypeSelect}
							popoverProps={{
								targetClassName: 'full-width',
							}}
							selected={this.state.type}
						/>
					</FormGroup>

					{damagePhialTypes.indexOf(this.state.type) > -1 && (
						<FormGroup label="Damage" labelFor="damage">
							<InputGroup name="damage" onChange={this.onDamageChange} value={this.state.damage} />
						</FormGroup>
					)}
				</>
			</AttributeDialog>
		);
	}

	private renderPhialTypeText = (type: PhialTypes) => ucfirst(type);

	private onDamageChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		damage: cleanNumberString(event.currentTarget.value, false),
	});

	private onPhialTypeSelect = (type: PhialTypes) => {
		this.setState({
			type,
		});

		if (damagePhialTypes.indexOf(type) === -1) {
			this.setState({
				damage: null,
			});
		}
	};

	private save = () => {
		let value: string = this.state.type;

		if (this.state.damage)
			value += ` ${this.state.damage}`;

		this.props.onSave(this.props.attribute, value);
	};
}
