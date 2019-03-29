import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ArmorSetBonusList} from './ArmorSetBonusList';

export const ArmorSetBonuses: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/armor-sets/bonuses" exact={true} component={ArmorSetBonusList} />
	</Switch>
);
