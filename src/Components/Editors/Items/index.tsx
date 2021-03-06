import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ItemEditor} from './ItemEditor';
import {ItemList} from './ItemList';

export const Items: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/items" exact={true} component={ItemList} />
		<Route path="/objects/items/:item(\d+|new)" exact={true} component={ItemEditor} />
	</Switch>
);
