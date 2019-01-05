import * as React from 'react';
import {Route, Switch as ReactDomSwitch} from 'react-router-dom';
import {PageNotFound} from '../PageNotFound';

export const Switch: React.FC<{}> = props => (
	<ReactDomSwitch>
		{props.children}

		<Route component={PageNotFound} />
	</ReactDomSwitch>
);
