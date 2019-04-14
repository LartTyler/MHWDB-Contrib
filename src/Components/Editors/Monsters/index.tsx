import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {MonsterEditor} from './MonsterEditor';
import {MonsterList} from './MonsterList';

export const Monsters: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/monsters" exact={true} component={MonsterList} />
		<Route path="/objects/monsters/:monster(\d+|new)" exact={true} component={MonsterEditor} />
	</Switch>
);
