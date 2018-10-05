import Button from '@material-ui/core/Button/Button';
import * as React from 'react';
import {Redirect} from 'react-router';
import {ApiClient} from '../../Api';

interface LogoutButtonState {
	clicked: boolean;
}

export class LogoutButton extends React.Component<{}, LogoutButtonState> {
	public state: Readonly<LogoutButtonState> = {
		clicked: false,
	};

	private onButtonClick = () => {
		ApiClient.logout();

		this.setState({
			clicked: true,
		});
	};

	public render(): JSX.Element {
		if (this.state.clicked)
			return <Redirect to="/login" />;

		return (
			<Button onClick={this.onButtonClick}>
				Log out
			</Button>
		);
	}
}