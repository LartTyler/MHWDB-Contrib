import {Button, Classes, FormGroup, InputGroup} from '@blueprintjs/core';
import * as React from 'react';
import {ChangeEvent, FormEvent} from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {ApiClient} from '../../Api';
import './Login.scss';

interface LoginProps extends RouteComponentProps<{}> {
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
					error: error.message,
				});
			});
	};

	public render(): JSX.Element {
		if (this.state.redirect) {
			const {from} = this.props.location.state || {from: {pathname: '/'}};

			return <Redirect to={from} />;
		}

		return (
			<div id="login-component">
				<form onSubmit={this.onFormSubmit}>
					<FormGroup label="Email Address" labelFor="email-address">
						<InputGroup id="email-address" onChange={this.onInputChange('username')} />
					</FormGroup>

					<FormGroup label="Password" labelFor="password">
						<InputGroup id="password" type="password" onChange={this.onInputChange('password')} />
					</FormGroup>

					<Button type="submit">
						Sign In
					</Button>

					<a
						className={`${Classes.TEXT_MUTED} password-reset-link`}
						onClick={() => alert('Not yet supported :(')}
					>
						Forgot your password?
					</a>
				</form>
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

export const Login = withRouter(LoginComponent);