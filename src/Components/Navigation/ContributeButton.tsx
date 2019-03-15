import {Button, Menu, MenuItem, Popover, Position} from '@blueprintjs/core';
import * as React from 'react';
import {weaponTypeLabels} from '../../Api/Models/Weapon';
import {LinkedMenuItem} from './LinkedMenuItem';

const motionValueMenuItems: React.ReactNode[] = [];
const weaponMenuItems: React.ReactNode[] = [];

Object.entries(weaponTypeLabels).map(([type, label]) => {
	motionValueMenuItems.push((
		<LinkedMenuItem
			href={`/edit/motion-values/${type}`}
			key={type}
			text={label}
		/>
	));

	weaponMenuItems.push((
		<LinkedMenuItem
			href={`/edit/weapons/${type}`}
			key={type}
			text={label}
		/>
	));
});

export const ContributeButton: React.FC<{}> = () => {
	return (
		<Popover autoFocus={false} position={Position.BOTTOM_LEFT}>
			<Button minimal={true}>Contribute</Button>

			<Menu>
				<LinkedMenuItem href="/edit/ailments" text="Ailments" />
				<LinkedMenuItem href="/edit/armor" text="Armor" />
				<LinkedMenuItem href="/edit/charms" text="Charms" />
				<LinkedMenuItem href="/edit/decorations" text="Decorations" />
				<LinkedMenuItem href="/edit/items" text="Items" />
				<LinkedMenuItem href="/edit/locations" text="Locations" />

				<MenuItem text="Motion Values">
					{motionValueMenuItems}
				</MenuItem>

				<LinkedMenuItem href="/edit/skills" text="Skills" />

				<MenuItem text="Weapons">
					{weaponMenuItems}
				</MenuItem>
			</Menu>
		</Popover>
	);
};
