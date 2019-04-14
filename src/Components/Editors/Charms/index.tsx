import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {CharmEditor} from './CharmEditor';
import {CharmList} from './CharmList';

export const Charms: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/charms" exact={true} component={CharmList} />
		<Route path="/objects/charms/:charm(new|\d+)" exact={true} component={CharmEditor} />
	</Switch>
);
