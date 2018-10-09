import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import {ContentContainer} from '../ContentContainer';
import {AilmentEditor} from './Editors/AilmentEditor';

export const Editors: React.SFC<{}> = () => (
	<ContentContainer>
		<Switch>
			<Route path="/edit/ailments" component={AilmentEditor} />
		</Switch>
	</ContentContainer>
);