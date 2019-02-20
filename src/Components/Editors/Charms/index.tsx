import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {CharmList} from './CharmList';

export const Charms: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/charms" exact={true} component={CharmList} />
	</Switch>
);
