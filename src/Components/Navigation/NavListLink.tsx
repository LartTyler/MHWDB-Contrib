import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import {createLink} from '../createLink';

const styles = () => createStyles({
	link: {
		textDecoration: 'none',
	},
});

interface NavListLinkProps extends WithStyles<typeof styles> {
	linkTo: string;
	icon?: React.ReactElement<any>,
	disableTypography?: boolean;
	inset?: boolean;
}

const NavListLinkComponent: React.SFC<NavListLinkProps> = props => {
	const icon = props.icon && (
		<ListItemIcon>
			{props.icon}
		</ListItemIcon>
	);

	const inset = 'inset' in props ? props.inset : typeof icon !== 'undefined';

	return (
		<ListItem
			button={true}
			component={createLink(props.linkTo)}
			className={props.classes.link}
			selected={props.linkTo === window.location.pathname}
		>
			{icon}

			<ListItemText disableTypography={props.disableTypography} inset={inset}>
				{props.children}
			</ListItemText>
		</ListItem>
	);
};

export const NavListLink = withStyles(styles)(NavListLinkComponent);