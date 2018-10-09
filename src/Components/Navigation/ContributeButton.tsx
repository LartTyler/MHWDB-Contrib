import {Button, Menu, MenuItem, Popover, PopoverInteractionKind, Position} from '@blueprintjs/core';
import * as React from 'react';
import {ManualLink} from './ManualLink';

export const ContributeButton: React.SFC<{}> = () => {
	return (
		<Popover position={Position.BOTTOM_LEFT}>
			<Button minimal={true}>Contribute</Button>

			<Menu>
				<MenuItem
					text={(
						<ManualLink className="plain-link" to="/edit/ailments">
							Ailments
						</ManualLink>
					)}
				/>
			</Menu>
		</Popover>
	);
};