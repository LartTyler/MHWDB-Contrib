import * as React from 'react';

export const Manager: React.SFC<{}> = props => (
	<div className="entity-manager-component">
		{props.children}
	</div>
);
