import * as React from 'react';
import {Durability} from '../../../Api/Models/Weapon';
import './DurabilityBar.scss';

const barOrder: Array<keyof Durability> = [
	'red',
	'orange',
	'yellow',
	'green',
	'blue',
	'white',
];

interface IProps {
	durability: Durability;
}

export const DurabilityBar: React.FC<IProps> = props => {
	let sum = 0;

	return (
		<div className="durability-bar">
			{barOrder.map(color => {
				sum += props.durability[color];

				return (
					<div
						className={`durability durability-${color}`}
						key={color}
						style={{
							width: `${props.durability[color] / 400 * 100}%`,
						}}
					/>
				);
			})}

			{sum < 400 && (
				<div
					className="durability durability-empty"
					style={{
						width: `${(400 - sum) / 400 * 100}%`,
					}}
				/>
			)}
		</div>
	);
};
