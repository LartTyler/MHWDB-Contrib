import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ArmorList} from './ArmorList';

export const Armor: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/armor" exact={true} component={ArmorList} />
	</Switch>
);
