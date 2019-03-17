import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {WeaponEditor} from './WeaponEditor';
import {WeaponList} from './WeaponList';

export const Weapons: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/weapons/:weaponType([A-Za-z-]+)" exact={true} component={WeaponList} />
		<Route path="/edit/weapons/:weaponType([A-Za-z-]+)/:weapon(\d+|new)" exact={true} component={WeaponEditor} />
	</Switch>
);
