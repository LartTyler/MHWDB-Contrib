import {Classes} from '@blueprintjs/core';
import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Login} from './Components/Auth/Login';
import {toaster, ToasterContext} from './Components/Contexts/ToasterContext';
import './Layout.scss';
import {PrivateRoute} from './Security/PrivateRoute';

export const Layout: React.SFC<{}> = () => (
	<div id="app-root" className={Classes.DARK}>
		<ToasterContext.Provider value={toaster}>
			<BrowserRouter>
				<Switch>
					<Route exact={true} path="/login" component={Login} />

					<PrivateRoute path="/" render={() => <span>Main component</span>} />
				</Switch>
			</BrowserRouter>
		</ToasterContext.Provider>
	</div>
);