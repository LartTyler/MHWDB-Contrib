import {Button, Classes, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {FormEvent} from 'react';
import {Redirect} from 'react-router';
import {login, tokenStore} from '../../Api/client';
import {history} from '../../history';
import {toaster} from '../Contexts/ToasterContext';
import './Login.scss';

interface ILoginState {
	username: string;
	password: string;
	redirect: boolean;
	processing: boolean;
	error: string;
}

export class Login extends React.Component<{}, ILoginState> {
	public state: Readonly<ILoginState> = {
		error: null,
		password: '',
		processing: false,
		redirect: false,
		username: '',
	};

	public render(): JSX.Element {
		if (this.state.redirect || tokenStore.isAuthenticated()) {
			const {from} = history.location.state || {from: {pathname: '/'}};

			if (!from.pathname || from.pathname === '/login')
				from.pathname = '/';

			return <Redirect to={from} />;
		}

		return (
			<div id="login-component">
				<form onSubmit={this.onFormSubmit}>
					<FormGroup label="Email Address" labelFor="email-address">
						<InputGroup id="email-address" onChange={this.onUsernameInputChange} />
					</FormGroup>

					<FormGroup label="Password" labelFor="password">
						<InputGroup id="password" type="password" onChange={this.onPasswordInputChange} />
					</FormGroup>

					<Button type="submit" loading={this.state.processing}>
						Sign In
					</Button>

					<a
						className={`${Classes.TEXT_MUTED} password-reset-link`}
						onClick={() => alert('Not yet supported.')}
					>
						Forgot your password?
					</a>
				</form>
			</div>
		);
	}

	private onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		login(this.state.username, this.state.password)
			.then(() => this.setState({
				redirect: true,
			}))
			.catch((error: Error) => {
				this.setState({
					processing: false,
				});

				toaster.show({
					intent: Intent.WARNING,
					message: error.message,
				});
			});
	};

	private onUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		username: event.currentTarget.value,
	});

	private onPasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		password: event.currentTarget.value,
	});
}
