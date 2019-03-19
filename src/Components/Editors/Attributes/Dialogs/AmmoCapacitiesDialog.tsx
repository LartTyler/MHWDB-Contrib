import {FormGroup, InputGroup} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {AmmoCapacities, AmmoType, IAmmoCapacities} from '../../../../Api/Models/Weapon';
import {range} from '../../../../Utility/array';
import {cleanNumberString} from '../../../../Utility/number';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';

interface IProps extends IAttributeDialogProps<AmmoCapacities> {
}

interface IState {
	[AmmoType.NORMAL]: [number, number, number];
	[AmmoType.PIERCING]: [number, number, number];
	[AmmoType.SPREAD]: [number, number, number];
	[AmmoType.STICKY]: [number, number, number];
	[AmmoType.CLUSTER]: [number, number, number];
	[AmmoType.RECOVER]: [number, number];
	[AmmoType.POISON]: [number, number];
	[AmmoType.PARALYSIS]: [number, number];
	[AmmoType.SLEEP]: [number, number];
	[AmmoType.EXHAUST]: [number, number];
	[AmmoType.FLAMING]: [number];
	[AmmoType.WATER]: [number];
	[AmmoType.FREEZE]: [number];
	[AmmoType.THUNDER]: [number];
	[AmmoType.DRAGON]: [number];
	[AmmoType.SLICING]: [number];
	[AmmoType.WYVERN]: [number];
	[AmmoType.DEMON]: [number];
	[AmmoType.ARMOR]: [number];
	[AmmoType.TRANQ]: [number];
}

export class AmmoCapacitiesDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		const types: AmmoCapacities = {};

		for (const type of Object.values(AmmoType) as AmmoType[])
			types[type] = props.value[type];

		this.state = types as IAmmoCapacities;
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Ammo Capacities">
				<>
					<Row>
						<Cell size={6}>
							<FormGroup label="Normal">
								<Row>
									{range(0, 2).map(index => (
										<Cell key={index} size={4}>
											<InputGroup
												onChange={this.onNormalChange(index)}
												value={this.state.normal[index].toString(10)}
											/>
										</Cell>
									))}
								</Row>
							</FormGroup>
						</Cell>
					</Row>
				</>
			</AttributeDialog>
		);
	}

	private onNormalChange = (level: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
		this.state.normal[level] = parseInt(cleanNumberString(event.currentTarget.value), 10);

		this.forceUpdate();
	};

	private save = () => this.props.onSave(this.props.attribute, this.state);
}
