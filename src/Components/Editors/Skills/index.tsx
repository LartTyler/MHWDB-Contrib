import * as React from 'react';
import {Route} from 'react-router';
import {Switch} from '../../Navigation/Switch';
import {SkillEditor} from './SkillEditor';
import {SkillList} from './SkillList';

export const Skills: React.FC<{}> = () => (
	<Switch>
		<Route path="/edit/skills" exact={true} component={SkillList} />
		<Route path="/edit/skills/:skill(\d+|new)" exact={true} component={SkillEditor} />
	</Switch>
);
