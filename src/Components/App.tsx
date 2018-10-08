import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.scss';
import {Navigation} from './Navigation/Navigation';
import {PageNotFound} from './PageNotFound';

export const App: React.SFC<{}> = () => (
	<>
		<div id="app-navigation">
			<Navigation />
		</div>

		<div id="app-content">
			<BrowserRouter>
				<Switch>
					<Route component={PageNotFound} />
				</Switch>
			</BrowserRouter>
		</div>
	</>
);