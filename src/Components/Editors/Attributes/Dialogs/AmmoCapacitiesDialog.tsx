import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {AmmoCapacities, AmmoType} from '../../../../Api/Models/Weapon';
import {ucfirst} from '../../../../Utility/string';
import {AttributeDialog} from '../AttributeDialog';
import {IAttributeDialogProps} from '../AttributesEditor';
import {capacityInputsMap} from './AmmoCapacities';
import {NumberTuple} from './AmmoCapacities/CapacityInputs';

interface IProps extends IAttributeDialogProps<AmmoCapacities> {
}

interface IState {
	[key: string]: NumberTuple<any>;

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

		this.state = types as IState;
	}

	public render(): React.ReactNode {
		return (
			<AttributeDialog onClose={this.props.onClose} onSave={this.save} title="Ammo Capacities">
				<>
					<Row>
						{Object.values(AmmoType).map((type: AmmoType) => {
							const CapacityInputs = capacityInputsMap[type];

							return (
								<Cell key={type} size={6}>
									<CapacityInputs
										label={ucfirst(type)}
										onChange={values => this.onCapacityChange(type, values)}
										type={type}
										values={this.state[type]}
									/>
								</Cell>
							);
						})}
					</Row>
				</>
			</AttributeDialog>
		);
	}

	private onCapacityChange = (type: AmmoType, values: NumberTuple<1 | 2 | 3>) => this.setState({
		[type]: values,
	});

	private save = () => this.props.onSave(this.props.attribute, this.state);
}
