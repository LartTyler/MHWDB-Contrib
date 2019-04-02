import {Button, FormGroup, InputGroup} from '@blueprintjs/core';
import {Cell, PasswordStrengthChangeCallback, PasswordStrengthMeter, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {range} from '../../Utility/array';

const generatePassword = (() => {
	const passwordChars = []
		.concat(range(65, 90))
		.concat(range(97, 122))
		.concat(range(48, 57))
		.concat(range(33, 46))
		.concat(range(58, 64))
		.concat(range(91, 95))
		.concat(range(123, 126))
		.map(code => String.fromCharCode(code));

	const ByteArrayType = passwordChars.length <= 255 && Uint8Array ||
		passwordChars.length <= 65535 && Uint16Array ||
		Uint32Array;

	return (len: number = 28) => {
		const bytes = Array.from(window.crypto.getRandomValues(new ByteArrayType(len)));

		return bytes.map(byte => passwordChars[byte % passwordChars.length]).join('');
	};
})();

interface IPasswordChangeFormProps {
	onPasswordChange: (password: string, match: boolean) => void;

	loading?: boolean;
	onConfirmationChange?: (confirmation: string, match: boolean) => void;
	onPasswordStrengthChange?: PasswordStrengthChangeCallback;
}

interface IPasswordChangeFormState {
	confirmation: string;
	generated: boolean;
	password: string;
}

export class PasswordChangeForm extends React.PureComponent<IPasswordChangeFormProps, IPasswordChangeFormState> {
	public state: Readonly<IPasswordChangeFormState> = {
		confirmation: '',
		generated: false,
		password: '',
	};

	public render(): React.ReactNode {
		return (
			<Row>
				<Cell size={6}>
					<FormGroup
						helperText={(
							<PasswordStrengthMeter
								password={this.state.password}
								onChange={this.props.onPasswordStrengthChange}
							/>
						)}
						label="Password"
						labelFor="password"
					>
						<InputGroup
							className="password-manager-right-element-fix"
							name="password"
							onChange={this.onPasswordChange}
							rightElement={(
								<Button minimal={true} onClick={this.onGeneratePasswordButtonClick} tabIndex={-1}>
									Generate
								</Button>
							)}
							type={this.state.generated ? 'text' : 'password'}
							value={this.state.password}
						/>
					</FormGroup>
				</Cell>

				<Cell size={6}>
					<FormGroup label="Confirm Password" labelFor="confirmation">
						<InputGroup
							name="confirmation"
							onChange={this.onConfirmationChange}
							type={this.state.generated ? 'text' : 'password'}
							value={this.state.confirmation}
						/>
					</FormGroup>
				</Cell>
			</Row>
		);
	}

	private onConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		confirmation: event.currentTarget.value,
	}, () => {
		const match = this.state.password === this.state.confirmation;

		this.props.onPasswordChange(this.state.password, match);

		if (!this.props.onConfirmationChange)
			return;

		this.props.onConfirmationChange(this.state.confirmation, match);
	});

	private onGeneratePasswordButtonClick = () => {
		const password = generatePassword(28);

		this.setState({
			confirmation: password,
			generated: true,
			password,
		});

		this.props.onPasswordChange(password, true);

		if (this.props.onConfirmationChange)
			this.props.onConfirmationChange(password, true);
	};

	private onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		generated: false,
		password: event.currentTarget.value,
	}, () => this.props.onPasswordChange(this.state.password, this.state.password === this.state.confirmation));
}
