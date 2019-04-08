import {Button, H1, Intent} from '@blueprintjs/core';
import {Cell, IHashStats, Row} from '@dbstudios/blueprintjs-components';
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

class UserActivationComponent extends React.PureComponent<IProps, IState> {
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
			<div className="no-navbar content-container">
				<H1>Welcome!</H1>

				<p>
					Please fill out the form below to complete your registration.
				</p>

				<form onSubmit={this.onSubmit} style={{marginTop: 10}}>
					<PasswordChangeForm
						onPasswordChange={this.onPasswordChange}
						onPasswordStrengthChange={this.onPasswordStrengthChange}
					/>

					<Row align="end">
						<Cell size={1}>
							<Button
								disabled={!this.state.password || !this.state.passwordMatches || this.state.compromised}
								intent={Intent.PRIMARY}
								loading={this.state.processing}
								onClick={this.onSubmit}
							>
								Submit
							</Button>
						</Cell>
					</Row>
				</form>
			</div>
		);
	}

	private onPasswordChange = (password: string, match: boolean) => this.setState({
		password,
		passwordMatches: match,
	});

	private onPasswordStrengthChange = (stats: IHashStats) => this.setState({
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

		UserModel.activate(this.props.match.params.code, this.state.password).then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: 'Your account has been activated. Please log in.',
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

export const UserActivation = withRouter(UserActivationComponent);
