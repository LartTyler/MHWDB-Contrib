import Paper from '@material-ui/core/Paper/Paper';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
	paper: {
		padding: theme.spacing.unit * 2,
	},
});

interface HomeProps extends WithStyles<typeof styles> {
}

const HomeComponent: React.SFC<HomeProps> = props => (
	<div>
		<Typography variant="headline">
			Contributing
		</Typography>

		<Paper className={props.classes.paper}>
			<Typography component="p">
				Coming soon.
			</Typography>
		</Paper>
	</div>
);

export const Home = withStyles(styles)(HomeComponent);