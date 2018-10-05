import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Login} from './Components/Auth/Login';
import {PrivateRoute} from './Security/PrivateRoute';
import {Classes} from '@blueprintjs/core';
import './Layout.scss';

export const Layout: React.SFC<{}> = () => (
	<div id="app-root" className={Classes.DARK}>
		<BrowserRouter>
			<Switch>
				<Route exact={true} path="/login" component={Login} />

				<PrivateRoute path="/" render={() => <span>Main component</span>} />
			</Switch>
		</BrowserRouter>
	</div>
);