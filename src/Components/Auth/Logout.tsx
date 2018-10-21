import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {IApiClientAware, withApiClient} from '../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../Contexts/ToasterContext';

interface ILogoutProps extends RouteComponentProps<{}>, IToasterAware, IApiClientAware {
}

const LogoutComponent: React.SFC<ILogoutProps> = props => (
	<div
		onClick={() => {
			props.client.logout();
			props.history.push('/login');

			props.toaster.show({
				message: 'You have been logged out.',
			});
		}}
	>
		{props.children}
	</div>
);

export const Logout = withApiClient(withToasterContext(withRouter(LogoutComponent)));
