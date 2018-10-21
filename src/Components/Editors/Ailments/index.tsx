import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {AilmentList} from './AilmentList';

export const Ailments: React.SFC<{}> = () => (
	<Switch>
		<Route path="/edit/ailments" exact={true} component={AilmentList} />
	</Switch>
);
