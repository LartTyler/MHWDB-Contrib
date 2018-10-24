import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {AilmentEditor} from './AilmentEditor';
import {AilmentList} from './AilmentList';

export const Ailments: React.SFC<{}> = () => (
	<Switch>
		<Route path="/edit/ailments" exact={true} component={AilmentList} />
		<Route path="/edit/ailments/:ailment(\d+|new)" exact={true} component={AilmentEditor} />
	</Switch>
);
