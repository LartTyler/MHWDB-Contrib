import {FormGroup, InputGroup} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {AmmoType} from '../../../../../Api/Models/Weapon';
import {cleanNumberString} from '../../../../../Utility/number';

type DefaultLevelMap = {
	[P in AmmoType]: number;
};

const typeLevelCountMap: DefaultLevelMap = {
	[AmmoType.NORMAL]: 3,
	[AmmoType.PIERCING]: 3,
	[AmmoType.SPREAD]: 3,
	[AmmoType.STICKY]: 3,
	[AmmoType.CLUSTER]: 3,
	[AmmoType.RECOVER]: 2,
	[AmmoType.POISON]: 2,
	[AmmoType.PARALYSIS]: 2,
	[AmmoType.SLEEP]: 2,
	[AmmoType.EXHAUST]: 2,
	[AmmoType.FLAMING]: 1,
	[AmmoType.WATER]: 1,
	[AmmoType.FREEZE]: 1,
	[AmmoType.THUNDER]: 1,
	[AmmoType.DRAGON]: 1,
	[AmmoType.SLICING]: 1,
	[AmmoType.WYVERN]: 1,
	[AmmoType.DEMON]: 1,
	[AmmoType.ARMOR]: 1,
	[AmmoType.TRANQ]: 1,
};

export type NumberTuple<N extends number> =
	N extends 3 ? [number, number, number] :
		N extends 2 ? [number, number] :
			[number];

export interface ICapacityInputsProps<N extends number, R extends NumberTuple<N> = NumberTuple<N>> {
	label: string;
	onChange: (values: R) => void;
	type: AmmoType;

	values?: R;
}

interface IState<N extends number, R extends NumberTuple<N> = NumberTuple<N>> {
	values: R;
}

export class CapacityInputs<N extends number, R extends NumberTuple<N> = NumberTuple<N>>
	extends React.PureComponent<ICapacityInputsProps<N, R>, IState<N, R>> {
	public constructor(props: ICapacityInputsProps<N, R>) {
		super(props);

		this.state = {
			values: props.values || ((new Array(typeLevelCountMap[props.type]).fill(0)) as unknown) as R,
		};
	}

	public render(): React.ReactNode {
		return (
			<FormGroup label={this.props.label}>
				<Row>
					{this.state.values.map((value, index) => (
						<Cell size={3}>
							<InputGroup
								key={index}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									this.onValueChange(event.currentTarget.value, index);
								}}
								value={value.toString(10)}
							/>
						</Cell>
					))}
				</Row>
			</FormGroup>
		);
	}

	private onValueChange = (value: string, index: number) => {
		this.state.values[index] = parseInt(cleanNumberString(value, false), 10);

		this.props.onChange(this.state.values);
		this.forceUpdate();
	};

	public static ofType = <N extends number>() => {
		return CapacityInputs as new (props: ICapacityInputsProps<N>) => CapacityInputs<N>;
	};
}

export const CapacityInputsLevel3 = CapacityInputs.ofType<3>();
export const CapacityInputsLevel2 = CapacityInputs.ofType<2>();
export const CapacityInputsLevel1 = CapacityInputs.ofType<1>();
