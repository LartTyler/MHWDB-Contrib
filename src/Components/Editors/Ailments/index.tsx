import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {AilmentEditor} from './AilmentEditor';
import {AilmentList} from './AilmentList';

export const Ailments: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/ailments" exact={true} component={AilmentList} />
		<Route path="/objects/ailments/:ailment(\d+|new)" exact={true} component={AilmentEditor} />
	</Switch>
);
