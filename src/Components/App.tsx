import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.scss';
import {Login} from './Auth/Login';
import {PasswordReset} from './Auth/PasswordReset';
import {UserActivation} from './Auth/UserActivation';
import {Editors} from './Editors';
import {Home} from './Home';
import {Navigation} from './Navigation/Navigation';
import {PageNotFound} from './PageNotFound';
import {WorldEvents} from './WorldEvents/WorldEvents';

export const App: React.FC<{}> = () => (
	<>
		<div id="app-navigation">
			<Navigation />
		</div>

		<div id="app-content">
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/password-reset/:code" component={PasswordReset} />
				<Route path="/activate/:code" component={UserActivation} />

				<Route path="/" exact={true} component={Home} />
				<Route path="/events" exact={true} component={WorldEvents} />
				<Route path="/objects" component={Editors} />

				<Route component={PageNotFound} />
			</Switch>
		</div>
	</>
);
