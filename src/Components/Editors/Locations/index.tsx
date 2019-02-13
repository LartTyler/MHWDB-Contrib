import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {LocationEditor} from './LocationEditor';
import {LocationList} from './LocationList';

export const Locations: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/locations" exact={true} component={LocationList} />
		<Route path="/edit/locations/:location(new|\d+)" exact={true} component={LocationEditor} />
	</Switch>
);
