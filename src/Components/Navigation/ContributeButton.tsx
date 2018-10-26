import {Button, Menu, Popover, Position} from '@blueprintjs/core';
import * as React from 'react';
import {LinkedMenuItem} from './LinkedMenuItem';

export const ContributeButton: React.SFC<{}> = () => {
	return (
		<Popover position={Position.BOTTOM_LEFT}>
			<Button minimal={true}>Contribute</Button>

			<Menu>
				<LinkedMenuItem
					text="Ailments"
					href="/edit/ailments"
				/>

				<LinkedMenuItem
					href="/edit/items"
					text="Items"
				/>
			</Menu>
		</Popover>
	);
};