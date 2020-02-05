import * as React from 'react';
import {Durability, durabilityOrder} from '../../../Api/Models/Weapon';
import './DurabilityBar.scss';
import {Tooltip} from '@blueprintjs/core';
import {ucfirst} from '../../../Utility/string';

interface IProps {
	durability: Durability;
}

export const DurabilityBar: React.FC<IProps> = props => {
	let sum = 0;

	return (
		<div className="durability-bar">
			{durabilityOrder.map(color => {
				sum += props.durability[color];

				return (
					<Tooltip
						content={`${ucfirst(color)} / ${props.durability[color]} hits`}
						key={color}
						targetProps={{
							style: {
								display: 'inline-block',
								width: `${props.durability[color] / 400 * 100}%`
							}
						}}
					>
						<div className={`durability durability-${color}`} />
					</Tooltip>
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
