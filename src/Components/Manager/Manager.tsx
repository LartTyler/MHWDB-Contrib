import * as React from 'react';

export const Manager: React.FC<{}> = props => (
	<div className="entity-manager-component">
		{props.children}
	</div>
);
