import Button from '@material-ui/core/Button/Button';
import Paper from '@material-ui/core/Paper/Paper';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import PlusIcon from 'mdi-material-ui/Plus';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
	paper: {
		padding: theme.spacing.unit * 2,
	},
});

interface AilmentEditorProps extends WithStyles<typeof styles> {
}

class AilmentEditorComponent extends React.Component<AilmentEditorProps, {}> {
	public render(): JSX.Element {
		return (
			<div>
				<Typography variant="headline">
					Ailments
				</Typography>

				<Paper className={this.props.classes.paper}>
					<Button variant="contained" color="primary">
						<PlusIcon />

						Create
					</Button>
				</Paper>
			</div>
		);
	}
}

export const AilmentEditor = withStyles(styles)(AilmentEditorComponent);