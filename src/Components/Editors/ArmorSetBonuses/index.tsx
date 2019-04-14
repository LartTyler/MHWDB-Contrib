import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {ArmorSetBonusEditor} from './ArmorSetBonusEditor';
import {ArmorSetBonusList} from './ArmorSetBonusList';

export const ArmorSetBonuses: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/armor-sets/bonuses" exact={true} component={ArmorSetBonusList} />
		<Route path="/objects/armor-sets/bonuses/:armorSetBonus(\d+|new)" exact={true} component={ArmorSetBonusEditor} />
	</Switch>
);
