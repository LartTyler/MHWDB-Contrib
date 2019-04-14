import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {DecorationEditor} from './DecorationEditor';
import {DecorationList} from './DecorationList';

export const Decorations: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/decorations" exact={true} component={DecorationList} />
		<Route path="/objects/decorations/:decoration(new|\d+)" exact={true} component={DecorationEditor} />
	</Switch>
);
