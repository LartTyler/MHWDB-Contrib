import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ItemList} from './ItemList';

export const Items: React.SFC<{}> = () => (
	<Switch>
		<Route path="/edit/items" exact={true} component={ItemList} />
	</Switch>
);
