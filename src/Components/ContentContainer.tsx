import * as React from 'react';
import './ContentContainer.scss';

export const ContentContainer: React.SFC<{}> = props => (
	<div className="content-container">
		{props.children}
	</div>
);