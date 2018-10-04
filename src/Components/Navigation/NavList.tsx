import List from '@material-ui/core/List/List';
import * as React from 'react';

export const NavList: React.SFC<{}> = props => (
	<List component="nav">
		{props.children}
	</List>
);