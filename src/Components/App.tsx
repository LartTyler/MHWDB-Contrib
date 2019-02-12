import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.scss';
import {Editors} from './Editors';
import {Home} from './Home';
import {Navigation} from './Navigation/Navigation';
import {PageNotFound} from './PageNotFound';

export const App: React.FC<{}> = () => (
	<>
		<div id="app-navigation">
			<Navigation />
		</div>

		<div id="app-content">
			<Switch>
				<Route path="/" exact={true} component={Home} />
				<Route path="/edit" component={Editors} />

				<Route component={PageNotFound} />
			</Switch>
		</div>
	</>
);
