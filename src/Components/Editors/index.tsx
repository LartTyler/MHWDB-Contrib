import * as React from 'react';
import {Route} from 'react-router';
import {ContentContainer} from '../ContentContainer';
import {Switch} from '../Navigation/Switch';
import {Ailments} from './Ailments';

export const Editors: React.SFC<{}> = () => (
	<ContentContainer>
		<Switch>
			<Route path="/edit/ailments" component={Ailments} />
		</Switch>
	</ContentContainer>
);
