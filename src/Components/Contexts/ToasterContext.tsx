import {IToaster, Position, Toaster} from '@blueprintjs/core';
import * as React from 'react';
import {Subtract} from 'utility-types';

export const toaster = Toaster.create({
	position: Position.BOTTOM_LEFT,
});

export const ToasterContext = React.createContext(toaster);

export interface IToasterAware {
	toaster: IToaster;
}

export const withToasterContext = <P extends IToasterAware>(Component: React.ComponentType<P>):
	React.ComponentType<Subtract<P, IToasterAware>> => props => (
		<ToasterContext.Consumer>
			{value => <Component toaster={value} {...props} />}
		</ToasterContext.Consumer>
	);
