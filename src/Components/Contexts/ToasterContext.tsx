import {IToaster, Position, Toaster} from '@blueprintjs/core';
import * as React from 'react';
import {Subtract} from 'utility-types';

export const toaster = Toaster.create({
	position: Position.BOTTOM_LEFT,
});

export const ToasterContext = React.createContext(toaster);

export interface ToasterAware {
	toaster: IToaster;
}

export const withToasterContext = <P extends ToasterAware>(Component: React.ComponentType<P>): React.ComponentType<Subtract<P, ToasterAware>> => props => (
	<ToasterContext.Consumer>
		{toaster => <Component toaster={toaster} {...props} />}
	</ToasterContext.Consumer>
);