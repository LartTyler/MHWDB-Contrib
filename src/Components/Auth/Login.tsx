import {
	Button,
	createStyles,
	FormControl,
	Input,
	InputLabel,
	Paper,
	Theme,
	Typography,
	WithStyles,
	withStyles,
} from '@material-ui/core';
import * as React from 'react';
import {ChangeEvent, FormEvent} from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {ApiClient} from '../../Api';
import {Snackbar} from '../Snackbar';

const styles = (theme: Theme) => createStyles({
	layout: {
		width: 'auto',
		margin: '0 auto',
		[theme.breakpoints.up(400 + theme.spacing.unit * 6)]: {
			width: 400,
		},
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 3}px`,
		paddingTop: `${theme.spacing.unit * 2}px`,
	},
	button: {
		marginTop: theme.spacing.unit * 2,
	},
});

interface LoginProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {
}

interface LoginState {
	username: string;
	password: string;
	redirect: boolean;
	processing: boolean;
	error: string;
}

type ChangeCallback = (event: ChangeEvent<HTMLInputElement>) => void;

class LoginComponent extends React.Component<LoginProps, LoginState> {
	public state: Readonly<LoginState> = {
		username: '',
		password: '',
		redirect: false,
		processing: false,
		error: null,
	};

	private onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		ApiClient.login(this.state.username, this.state.password)
			.then(() => this.setState({
				redirect: true,
			}))
			.catch((error: Error) => {
				this.setState({
					processing: false,
					error: error.message
				});
			});
	};

	public render(): JSX.Element {
		if (this.state.redirect) {
			const {from} = this.props.location.state || {from: {pathname: '/'}};

			return <Redirect to={from} />;
		}

		const {classes} = this.props;
		const error = this.state.error ? (
			<Snackbar message={this.state.error} variant="error" />
		) : null;

		return (
			<div className={classes.layout}>
				<Paper className={classes.paper}>
					<Typography variant="headline">Sign in</Typography>

					<form onSubmit={this.onFormSubmit}>
						<FormControl margin="normal" required={true} fullWidth={true}>
							<InputLabel>Email Address</InputLabel>

							<Input
								name="email"
								autoFocus={true}
								onChange={this.onInputChange('username')}
								value={this.state.username}
							/>
						</FormControl>

						<FormControl margin="normal" required={true} fullWidth={true}>
							<InputLabel>Password</InputLabel>

							<Input
								name="password"
								type="password"
								value={this.state.password}
								onChange={this.onInputChange('password')}
							/>
						</FormControl>

						<Button
							type="submit"
							fullWidth={true}
							color="primary"
							variant="raised"
							className={classes.button}
						>
							Sign in
						</Button>
					</form>
				</Paper>

				{error}
			</div>
		);
	}

	private onInputChange(key: 'username' | 'password'): ChangeCallback {
		// The `ts-ignore` line below is in place because some IDEs (such as WebStorm) get very confused by the
		// expression. Rest assured, it compiles properly and with no warnings.
		//
		// @ts-ignore
		return event => this.setState({
			[key]: event.target.value,
		});
	}
}

export const Login = withStyles(styles)(withRouter(LoginComponent));