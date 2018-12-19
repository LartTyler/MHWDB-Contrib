import * as React from 'react';
import {Route} from 'react-router';
import {ContentContainer} from '../ContentContainer';
import {Switch} from '../Navigation/Switch';
import {Ailments} from './Ailments';
import {Armor} from './Armor';
import {Items} from './Items';
import {Skills} from './Skills';

export const Editors: React.SFC<{}> = () => (
	<ContentContainer>
		<Switch>
			<Route path="/edit/ailments" component={Ailments} />
			<Route path="/edit/armor" component={Armor} />
			<Route path="/edit/items" component={Items} />
			<Route path="/edit/skills" component={Skills} />
		</Switch>
	</ContentContainer>
);
