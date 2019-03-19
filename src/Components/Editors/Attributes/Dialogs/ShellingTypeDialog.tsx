import {FormGroup} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {ShellingType} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

const shellingTypes = Object.values(ShellingType);
const shellingLevels = [
	1,
	2,
	3,
	4,
];

interface IProps extends IAttributeDialogProps<string> {
}

interface IState {
	level: number;
	type: ShellingType;
}

export class ShellingTypeDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		if (props.value) {
			const parts = props.value.split(' Lv');

			this.state = {
				level: parseInt(parts[1].trim(), 10),
				type: parts[0].trim() as ShellingType,
			};
		} else {
			this.state = {
				level: 1,
				type: null,
			};
		}
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Shelling Type">
				<>
					<FormGroup label="Shelling Type" labelFor="type">
						<Select
							filterable={false}
							items={shellingTypes}
							itemTextRenderer={this.renderShellingTypeText}
							onItemSelect={this.onShellingTypeSelect}
							popoverProps={{
								targetClassName: 'full-width',
							}}
							selected={this.state.type}
						/>
					</FormGroup>

					<FormGroup label="Level" labelFor="level">
						<Select
							filterable={false}
							items={shellingLevels}
							itemTextRenderer={this.renderShellingLevelText}
							onItemSelect={this.onShellingLevelSelect}
							popoverProps={{
								targetClassName: 'full-width',
							}}
							selected={this.state.level}
						/>
					</FormGroup>
				</>
			</AttributeDialog>
		);
	}

	private renderShellingLevelText = (level: number) => `Level ${level}`;

	private renderShellingTypeText = (type: ShellingType) => ucfirst(type);

	private onShellingLevelSelect = (level: number) => this.setState({
		level,
	});

	private onShellingTypeSelect = (type: ShellingType) => this.setState({
		type,
	});

	private save = () => this.props.onSave(this.props.attribute, `${this.state.type} Lv${this.state.level}`);
}
