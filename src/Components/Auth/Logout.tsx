import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {ApiClient} from '../../Api';
import {ToasterAware, withToasterContext} from '../Contexts/ToasterContext';

interface LogoutProps extends RouteComponentProps<{}>, ToasterAware {
}

const LogoutComponent: React.SFC<LogoutProps> = props => (
	<div
		onClick={() => {
			ApiClient.logout();
			props.history.push('/login');

			props.toaster.show({
				message: 'You have been logged out.',
			});
		}}
	>
		{props.children}
	</div>
);

export const Logout = withToasterContext(withRouter(LogoutComponent));