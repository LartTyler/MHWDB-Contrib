import {Button, Menu, MenuItem, Popover, Position} from '@blueprintjs/core';
import * as React from 'react';
import {weaponTypeLabels} from '../../Api/Models/Weapon';
import {LinkedMenuItem} from './LinkedMenuItem';

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
					{Object.entries(weaponTypeLabels).map(pair => (
						<LinkedMenuItem
							href={`/edit/motion-values/${pair[0]}`}
							key={pair[0]}
							text={pair[1]}
						/>
					))}
				</MenuItem>

				<LinkedMenuItem href="/edit/skills" text="Skills" />
			</Menu>
		</Popover>
	);
};
