import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {SkillList} from './SkillList';

export const Skills: React.SFC<{}> = () => (
	<Switch>
		<Route path="/edit/skills" exact={true} component={SkillList} />
	</Switch>
);
