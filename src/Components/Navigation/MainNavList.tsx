import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import {createLink} from '../createLink';

const styles = () => createStyles({
	link: {
		textDecoration: 'none',
	},
});

interface MainNavListProps extends WithStyles<typeof styles> {
}

const MainNavListComponent: React.SFC<MainNavListProps> = props => (
	<List component="nav">
		<ListItem button={true} className={props.classes.link} component={createLink('/')}>
			<ListItemText primary="Home" />
		</ListItem>
	</List>
);

export const MainNavList = withStyles(styles)(MainNavListComponent);