import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {MotionValueEditor} from './MotionValueEditor';
import {MotionValueList} from './MotionValueList';

export const MotionValues: React.FC<{}> = () => (
	<Switch>
		<Route path="/objects/motion-values/:weaponType([A-Za-z-]+)" exact={true} component={MotionValueList} />

		<Route
			path="/objects/motion-values/:weaponType([A-Za-z-]+)/:motionValue(\d+|new)"
			exact={true}
			component={MotionValueEditor}
		/>
	</Switch>
);
