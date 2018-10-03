import {createStyles, Snackbar as MuiSnackbar, Theme, WithStyles, withStyles} from '@material-ui/core';
import {amber, green} from '@material-ui/core/colors';
import {SvgIconProps} from '@material-ui/core/SvgIcon';
import {
	CheckCircle as CheckCircleIcon,
	Error as ErrorIcon,
	Info as InfoIcon,
	Warning as WarningIcon,
} from '@material-ui/icons';
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
		autoHideDuration: 6000,
		variant: 'default',
	};

	public state: Readonly<SnackbarState> = {
		open: true,
	};

	private onSnackbarClose = (event: React.SyntheticEvent<any>, reason: SnackbarCloseReason): void => {
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
				onClose={this.onSnackbarClose}
				open={this.state.open}
				className={classes[variant]}
				message={message}
			/>
		);
	}
}

export const Snackbar = withStyles(styles)(SnackbarComponent);