import {IToaster, Position, Toaster} from '@blueprintjs/core';
import * as React from 'react';

export const toaster = Toaster.create({
	position: Position.BOTTOM_LEFT,
});

export const ToasterContext: React.Context<IToaster> = React.createContext(toaster);

export interface ToasterComponentProps {
	toaster: IToaster;
}

export const withToaster = <T extends ToasterComponentProps>(Component: React.ComponentType<T>) => (props: T) => (
	<ToasterContext.Consumer>
		{toaster => <Component toaster={toaster} {...props} />}
	</ToasterContext.Consumer>
);