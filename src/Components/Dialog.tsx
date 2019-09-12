import {Classes, Dialog as BlueprintDialog, IDialogProps} from '@blueprintjs/core';
import * as React from 'react';
import {Theme, ThemeContext} from './Contexts/ThemeContext';

export const Dialog: React.FC<IDialogProps> = props => (
	<ThemeContext.Consumer>
		{theme => (
			<BlueprintDialog
				{...props}
				className={`${theme === Theme.DARK ? Classes.DARK : ''} ${props.className || ''}`}
			/>
		)}
	</ThemeContext.Consumer>
);
