import {Button, Classes, H5, Intent, Popover} from '@blueprintjs/core';
import * as React from 'react';

interface IButtonWithConfirmProps {
	message: React.ReactNode;
	onConfirm: () => void;
	title?: React.ReactNode;
}

export const Confirm: React.FC<IButtonWithConfirmProps> = props => (
	<Popover popoverClassName={Classes.POPOVER_CONTENT_SIZING}>
		{props.children}

		<div>
			{props.title}

			{props.message}

			<div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 15}}>
				<Button className={Classes.POPOVER_DISMISS} intent={Intent.NONE} style={{marginRight: 10}}>
					Cancel
				</Button>

				<Button className={Classes.POPOVER_DISMISS} intent={Intent.PRIMARY} onClick={props.onConfirm}>
					Confirm
				</Button>
			</div>
		</div>
	</Popover>
);

Confirm.defaultProps = {
	title: <H5>Please Confirm</H5>,
};
