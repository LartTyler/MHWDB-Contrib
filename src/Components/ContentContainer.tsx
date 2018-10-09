import {Callout} from '@blueprintjs/core';
import * as React from 'react';
import './ContentContainer.scss';

export const ContentContainer: React.SFC<{}> = props => (
	<Callout className="content-container">
		{props.children}
	</Callout>
);