import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import MuiSnackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import {SvgIconProps} from '@material-ui/core/SvgIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import * as React from 'react';

type SnackbarCloseReason = 'timeout' | 'clickaway';
type SnackbarVariant = 'default' | 'success' | 'info' | 'warning' | 'error';

type IconSet = {
	[key in SnackbarVariant]: React.ComponentType<SvgIconProps>;
};

const variantIcons: IconSet = {
	default: null,
	success: CheckCircleIcon,
	info: InfoIcon,
	warning: WarningIcon,
	error: ErrorIcon,
};

const styles = (theme: Theme) => createStyles({
	default: {},
	success: {
		backgroundColor: green[600],
	},
	info: {
		backgroundColor: theme.palette.primary.dark,
	},
	warning: {
		backgroundColor: amber[700],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	layout: {
		margin: theme.spacing.unit,
	},
	icon: {
		fontSize: 20,
		opacity: 0.9,
		marginRight: theme.spacing.unit,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
});

interface SnackbarProps extends WithStyles<typeof styles> {
	message: React.ReactNode;
	autoHideDuration?: number;
	variant?: SnackbarVariant;
	onClose?: (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason) => void;
}

interface SnackbarState {
	open: boolean;
}

class SnackbarComponent extends React.Component<SnackbarProps, SnackbarState> {
	public static defaultProps: Partial<SnackbarProps> = {
		autoHideDuration: 3000,
		variant: 'default',
	};

	public state: Readonly<SnackbarState> = {
		open: true,
	};

	private onSnackbarClose = (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason): void => {
		if (reason === 'clickaway')
			return;

		this.setState({
			open: false,
		});

		if (this.props.onClose)
			this.props.onClose(event, reason);
	};

	public render(): JSX.Element {
		const {classes, variant} = this.props;

		const Icon = variantIcons[variant];
		const message = (
			<span>
				<Icon className={classes.icon} />

				{this.props.message}
			</span>
		);

		return (
			<MuiSnackbar
				open={this.state.open}
				onClose={this.onSnackbarClose}
				className={classes.layout}
				autoHideDuration={this.props.autoHideDuration}
			>
                <SnackbarContent
					className={classes[variant]}
					message={message}
				/>
            </MuiSnackbar>
		);
	}
}

export const Snackbar = withStyles(styles)(SnackbarComponent);