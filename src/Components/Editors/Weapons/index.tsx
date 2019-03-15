import * as React from 'react';
import {Switch} from '../../Navigation/Switch';
import {Route} from 'react-router';
import {WeaponList} from './WeaponList';

export const Weapons: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/weapons/:weaponType([A-Za-z-]+)" exact={true} component={WeaponList} />
	</Switch>
);
