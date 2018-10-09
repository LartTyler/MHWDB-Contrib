import {Callout} from '@blueprintjs/core';
import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.scss';
import {Editors} from './Editor/Editors';
import {Navigation} from './Navigation/Navigation';
import {PageNotFound} from './PageNotFound';

export const App: React.SFC<{}> = () => (
	<>
		<div id="app-navigation">
			<Navigation />
		</div>

		<div id="app-content">
			<Switch>
				<Route path="/edit" component={Editors} />

				<Route component={PageNotFound} />
			</Switch>
		</div>
	</>
);