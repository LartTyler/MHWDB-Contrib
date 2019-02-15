import {Button, Menu, Popover, Position} from '@blueprintjs/core';
import * as React from 'react';
import {LinkedMenuItem} from './LinkedMenuItem';

export const ContributeButton: React.FC<{}> = () => {
	return (
		<Popover position={Position.BOTTOM_LEFT}>
			<Button minimal={true}>Contribute</Button>

			<Menu>
				<LinkedMenuItem href="/edit/ailments" text="Ailments" />
				<LinkedMenuItem href="/edit/armor" text="Armor" />
				<LinkedMenuItem href="/edit/decorations" text="Decorations" />
				<LinkedMenuItem href="/edit/items" text="Items" />
				<LinkedMenuItem href="/edit/locations" text="Locations" />
				<LinkedMenuItem href="/edit/skills" text="Skills" />
			</Menu>
		</Popover>
	);
};
