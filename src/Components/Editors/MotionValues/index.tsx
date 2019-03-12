import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {MotionValueList} from './MotionValueList';

export const MotionValues: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/motion-values/:weaponType([A-Za-z-]+)" exact={true} component={MotionValueList} />
	</Switch>
);
