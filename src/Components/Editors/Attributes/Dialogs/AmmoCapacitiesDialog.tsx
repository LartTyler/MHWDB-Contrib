import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {AmmoCapacities, AmmoType, IAmmoCapacities} from '../../../../Api/Models/Weapon';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';
import {CapacityInputsLevel2, CapacityInputsLevel3, NumberTuple} from './AmmoCapacities/CapacityInputs';

interface IProps extends IAttributeDialogProps<AmmoCapacities> {
}

interface IState {
	[AmmoType.NORMAL]: NumberTuple<3>;
	[AmmoType.PIERCING]: NumberTuple<3>;
	[AmmoType.SPREAD]: NumberTuple<3>;
	[AmmoType.STICKY]: NumberTuple<3>;
	[AmmoType.CLUSTER]: NumberTuple<3>;
	[AmmoType.RECOVER]: NumberTuple<2>;
	[AmmoType.POISON]: NumberTuple<2>;
	[AmmoType.PARALYSIS]: NumberTuple<2>;
	[AmmoType.SLEEP]: NumberTuple<2>;
	[AmmoType.EXHAUST]: NumberTuple<2>;
	[AmmoType.FLAMING]: NumberTuple<1>;
	[AmmoType.WATER]: NumberTuple<1>;
	[AmmoType.FREEZE]: NumberTuple<1>;
	[AmmoType.THUNDER]: NumberTuple<1>;
	[AmmoType.DRAGON]: NumberTuple<1>;
	[AmmoType.SLICING]: NumberTuple<1>;
	[AmmoType.WYVERN]: NumberTuple<1>;
	[AmmoType.DEMON]: NumberTuple<1>;
	[AmmoType.ARMOR]: NumberTuple<1>;
	[AmmoType.TRANQ]: NumberTuple<1>;
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
							<CapacityInputsLevel3
								label="Normal"
								onChange={this.onNormalChange}
								type={AmmoType.NORMAL}
								values={this.state[AmmoType.NORMAL]}
							/>
						</Cell>

						<Cell size={6}>
							<CapacityInputsLevel3
								label="Piercing"
								onChange={this.onPiercingChange}
								type={AmmoType.PIERCING}
								values={this.state[AmmoType.PIERCING]}
							/>
						</Cell>
					</Row>

					<Row>
						<Cell size={6}>
							<CapacityInputsLevel3
								label="Spread"
								onChange={this.onSpreadChange}
								type={AmmoType.SPREAD}
								values={this.state[AmmoType.SPREAD]}
							/>
						</Cell>

						<Cell size={6}>
							<CapacityInputsLevel3
								label="Sticky"
								onChange={this.onStickyChange}
								type={AmmoType.STICKY}
								values={this.state[AmmoType.STICKY]}
							/>
						</Cell>
					</Row>

					<Row>
						<Cell size={6}>
							<CapacityInputsLevel3
								label="Cluster"
								onChange={this.onClusterChange}
								type={AmmoType.CLUSTER}
								values={this.state[AmmoType.CLUSTER]}
							/>
						</Cell>

						<Cell size={6}>
							<CapacityInputsLevel2
								label="Recover"
								onChange={this.onRecoverChange}
								type={AmmoType.RECOVER}
								values={this.state[AmmoType.RECOVER]}
							/>
						</Cell>
					</Row>

					<Row>
						<Cell size={6}>
							<CapacityInputsLevel2
								label="Poison"
								onChange={this.onPoisonChange}
								type={AmmoType.POISON}
								values={this.state[AmmoType.POISON]}
							/>
						</Cell>

						<Cell size={6}>
							<CapacityInputsLevel2
								label="Paralysis"
								onChange={this.onParalysisChange}
								type={AmmoType.PARALYSIS}
								values={this.state[AmmoType.PARALYSIS]}
							/>
						</Cell>
					</Row>
				</>
			</AttributeDialog>
		);
	}

	private onNormalChange = (values: NumberTuple<3>) => this.setState({
		[AmmoType.NORMAL]: values,
	});

	private onPiercingChange = (values: NumberTuple<3>) => this.setState({
		[AmmoType.PIERCING]: values,
	});

	private onSpreadChange = (values: NumberTuple<3>) => this.setState({
		[AmmoType.SPREAD]: values,
	});

	private onStickyChange = (values: NumberTuple<3>) => this.setState({
		[AmmoType.STICKY]: values,
	});

	private onClusterChange = (values: NumberTuple<3>) => this.setState({
		[AmmoType.CLUSTER]: values,
	});

	private onRecoverChange = (values: NumberTuple<2>) => this.setState({
		[AmmoType.RECOVER]: values,
	});

	private onPoisonChange = (values: NumberTuple<2>) => this.setState({
		[AmmoType.POISON]: values,
	});

	private onParalysisChange = (values: NumberTuple<2>) => this.setState({
		[AmmoType.PARALYSIS]: values,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state);
}
