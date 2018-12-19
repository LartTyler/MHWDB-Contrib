import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ArmorEditor} from './ArmorEditor';
import {ArmorList} from './ArmorList';

export const Armor: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/armor" exact={true} component={ArmorList} />
		<Route path="/edit/armor/:armor(\d+|new)" exact={true} component={ArmorEditor} />
	</Switch>
);
