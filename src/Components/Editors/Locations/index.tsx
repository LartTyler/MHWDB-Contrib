import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {LocationList} from './LocationList';

export const Locations: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/locations" exact={true} component={LocationList} />
	</Switch>
);
