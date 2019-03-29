import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ArmorSetEditor} from './ArmorSetEditor';
import {ArmorSetList} from './ArmorSetList';

export const ArmorSets: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/armor-sets" exact={true} component={ArmorSetList} />
		<Route path="/edit/armor-sets/:armorSet(\d+|new)" exact={true} component={ArmorSetEditor} />
	</Switch>
);
