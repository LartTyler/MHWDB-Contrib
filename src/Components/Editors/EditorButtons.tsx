import {Button, Classes, Intent} from '@blueprintjs/core';
import * as React from 'react';

interface IProps {
	onClose: () => void;
	onSave: () => void;
	readOnly: boolean;
	saving: boolean;
}

export const EditorButtons: React.FC<IProps> = props => (
	<div className={Classes.DIALOG_FOOTER_ACTIONS}>
		<Button disabled={props.saving} onClick={props.onClose}>
			Close
		</Button>

		{!props.readOnly && (
			<Button intent={Intent.PRIMARY} loading={props.saving} onClick={props.onSave}>
				Save
			</Button>
		)}
	</div>
);
