import {Button, H1, Intent} from '@blueprintjs/core';
import {Cell, PasswordStrengthChangeCallback, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {UserModel} from '../../Api/Models/User';
import {toaster} from '../../toaster';
import {PasswordChangeForm} from './PasswordChangeForm';

interface IRouteProps {
	code: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	compromised: boolean;
	password: string;
	passwordMatches: boolean;
	processing: boolean;
	redirect: boolean;
}

class PasswordResetComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		compromised: false,
		password: '',
		passwordMatches: true,
		processing: false,
		redirect: false,
	};

	public render(): React.ReactNode {
		if (this.state.redirect)
			return <Redirect to="/login" />;

		return (
			<div className="content-container">
				<H1>Reset Your Password</H1>

				<p>
					Please use the form below to change your password. After submitting the form, you will be prompted
					to log in.
				</p>

				<form onSubmit={this.onSubmit}>
					<PasswordChangeForm
						onPasswordChange={this.onPasswordChange}
						onPasswordStrengthChange={this.onPasswordStrengthChange}
					/>

					<Row>
						<Cell size={2}>
							<Button disabled={this.state.processing} onClick={this.onCancelClick}>
								Cancel
							</Button>

							<Button
								disabled={!this.state.password || !this.state.passwordMatches || this.state.compromised}
								intent={Intent.PRIMARY}
								loading={this.state.processing}
								onClick={this.onSubmit}
								style={{marginLeft: 10}}
							>
								Submit
							</Button>
						</Cell>
					</Row>
				</form>
			</div>
		);
	}

	private onCancelClick = () => this.setState({
		redirect: true,
	});

	private onPasswordChange = (password: string, passwordMatches: boolean) => this.setState({
		password,
		passwordMatches,
	});

	private onPasswordStrengthChange: PasswordStrengthChangeCallback = stats => this.setState({
		compromised: stats.compromised,
	});

	private onSubmit = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		UserModel.resetPassword(this.props.match.params.code, this.state.password).then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: 'Your password has been reset. Please log in.',
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			this.setState({
				processing: false,
			});
		});
	};
}

export const PasswordReset = withRouter(PasswordResetComponent);
