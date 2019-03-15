import {Button, Classes, Dialog, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	children: React.ReactChild;
	onClose: () => void;
	onSave: () => void;
	title: React.ReactNode;

	isOpen?: boolean;
}

export const AttributeDialog: React.FC<IProps> = props => (
	<ThemeContext.Consumer>
		{theme => (
			<Dialog
				className={theme === Theme.DARK ? Classes.DARK : ''}
				onClose={props.onClose}
				isOpen={props.isOpen}
				title={props.title}
			>
				<div className={Classes.DIALOG_BODY}>
					{props.children}
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={props.onClose}>
							Cancel
						</Button>

						<Button intent={Intent.PRIMARY} onClick={props.onSave}>
							Save
						</Button>
					</div>
				</div>
			</Dialog>
		)}
	</ThemeContext.Consumer>
);

AttributeDialog.defaultProps = {
	isOpen: true,
};
