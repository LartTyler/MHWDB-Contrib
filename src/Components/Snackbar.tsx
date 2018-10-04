import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MuiSnackbar from '@material-ui/core/Snackbar';
import MuiSnackbarContent from '@material-ui/core/SnackbarContent';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import {SvgIconProps} from '@material-ui/core/SvgIcon/SvgIcon';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';

type CloseReason = 'timeout' | 'clickaway' | 'dismiss';
type CloseEventHandler = (reason: CloseReason) => void;
type Variant = 'default' | 'success' | 'info' | 'warning' | 'error';
type IconSet = {
	[key in Variant]: React.ComponentType<SvgIconProps>;
};

const icons: IconSet = {
	default: null,
	success: SuccessIcon,
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
	root: {
		margin: theme.spacing.unit,
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing.unit,
	},
	close: {
		padding: theme.spacing.unit / 2,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
});

interface SnackbarProps extends WithStyles<typeof styles> {
	message: React.ReactNode,
	autoHideDuration?: number;
	variant?: Variant;
	onClose?: CloseEventHandler;
}

interface SnackbarState {
	open: boolean;
}

class SnackbarComponent extends React.Component<SnackbarProps, SnackbarState> {
	public static defaultProps: Partial<SnackbarProps> = {
		autoHideDuration: 5000,
		variant: 'default',
	};

	public state: Readonly<SnackbarState> = {
		open: true,
	};

	private onSnackbarAutoHide = (event: React.SyntheticEvent<any>, reason: CloseReason): void => {
		if (reason === 'clickaway')
			return;

		this.setState({
			open: false,
		});

		if (this.props.onClose)
			setTimeout(() => this.props.onClose(reason), 500);
	};

	private onSnackbarDismiss = () => {
		this.setState({
			open: false,
		});

		if (this.props.onClose)
			setTimeout(() => this.props.onClose('dismiss'), 500);
	};

	public render(): JSX.Element {
		const {classes, variant} = this.props;
		const Icon = icons[variant];

		const message = (
			<span className={classes.message}>
				<Icon className={`${classes.icon} ${classes.iconVariant}`} />

				{this.props.message}
			</span>
		);

		return (
			<MuiSnackbar
				open={this.state.open}
				onClose={this.onSnackbarAutoHide}
				className={classes.root}
				autoHideDuration={this.props.autoHideDuration}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<MuiSnackbarContent
					message={message}
					className={classes[variant]}
					action={[
						<IconButton
							key="close"
							color="inherit"
							className={classes.close}
							onClick={this.onSnackbarDismiss}
						>
							<CloseIcon className={classes.icon} />
						</IconButton>
					]}
				/>
			</MuiSnackbar>
		);
	}
}

export const Snackbar = withStyles(styles)(SnackbarComponent);