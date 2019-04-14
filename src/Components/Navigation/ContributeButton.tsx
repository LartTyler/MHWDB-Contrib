import {Button, Menu, MenuItem, Popover, Position} from '@blueprintjs/core';
import * as React from 'react';
import {weaponTypeLabels} from '../../Api/Models/Weapon';
import {LinkedMenuItem} from './LinkedMenuItem';

const motionValueMenuItems: React.ReactNode[] = [];
const weaponMenuItems: React.ReactNode[] = [];

Object.entries(weaponTypeLabels).map(([type, label]) => {
	motionValueMenuItems.push((
		<LinkedMenuItem
			href={`/objects/motion-values/${type}`}
			key={type}
			text={label}
		/>
	));

	weaponMenuItems.push((
		<LinkedMenuItem
			href={`/objects/weapons/${type}`}
			key={type}
			text={label}
		/>
	));
});

export const ContributeButton: React.FC<{}> = () => {
	return (
		<Popover autoFocus={false} position={Position.BOTTOM_LEFT}>
			<Button minimal={true}>Objects</Button>

			<Menu>
				<LinkedMenuItem href="/objects/ailments" text="Ailments" />
				<LinkedMenuItem href="/objects/armor" text="Armor" />
				<LinkedMenuItem href="/objects/armor-sets" text="Armor Sets" />
				<LinkedMenuItem href="/objects/armor-sets/bonuses" text="Armor Set Bonuses" />
				<LinkedMenuItem href="/objects/charms" text="Charms" />
				<LinkedMenuItem href="/objects/decorations" text="Decorations" />
				<LinkedMenuItem href="/objects/items" text="Items" />
				<LinkedMenuItem href="/objects/locations" text="Locations" />
				<LinkedMenuItem href="/objects/monsters" text="Monsters" />

				<MenuItem text="Motion Values">
					{motionValueMenuItems}
				</MenuItem>

				<LinkedMenuItem href="/objects/skills" text="Skills" />

				<MenuItem text="Weapons">
					{weaponMenuItems}
				</MenuItem>
			</Menu>
		</Popover>
	);
};
