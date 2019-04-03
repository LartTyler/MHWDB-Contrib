import {Button, Classes, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {UserModel} from '../../Api/Models/User';
import {toaster} from '../../toaster';
import {Theme, ThemeContext} from '../Contexts/ThemeContext';

interface IProps {
	isOpen: boolean;
	onClose: () => void;
}

interface IState {
	email: string;
	processing: boolean;
}

export class PasswordResetRequestDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		email: '',
		processing: false,
	};

	public render(): React.ReactNode {
		return (
			<ThemeContext.Consumer>
				{theme => (
					<Dialog
						canEscapeKeyClose={!this.state.processing}
						canOutsideClickClose={!this.state.processing}
						className={theme === Theme.DARK ? Classes.DARK : ''}
						isCloseButtonShown={!this.state.processing}
						isOpen={this.props.isOpen}
						onClose={this.onClose}
						title="Reset Your Password"
					>
						<div className={Classes.DIALOG_BODY}>
							<p>
								To reset your password, please enter your email address in the form below. If an account
								with that email address exists, you should receive an email with instructions shortly.
							</p>

							<form onSubmit={this.onSubmit}>
								<FormGroup label="Email Address" labelFor="email">
									<InputGroup
										name="email"
										onChange={this.onEmailChange}
										value={this.state.email}
									/>
								</FormGroup>
							</form>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button disabled={this.state.processing} onClick={this.onClose}>
									Cancel
								</Button>

								<Button intent={Intent.PRIMARY} loading={this.state.processing} onClick={this.onSubmit}>
									Submit
								</Button>
							</div>
						</div>
					</Dialog>
				)}
			</ThemeContext.Consumer>
		);
	}

	private onClose = () => {
		this.setState({
			email: '',
			processing: false,
		});

		this.props.onClose();
	};

	private onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		email: event.currentTarget.value,
	});

	private onSubmit = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.processing)
			return;

		this.setState({
			processing: true,
		});

		UserModel.sendPasswordResetCode(this.state.email).then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: 'Reset request sent. Check your inbox for instructions.',
			});

			this.onClose();
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
