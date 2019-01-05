import * as React from 'react';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router';
import {IApiClientAware, withApiClient} from '../Components/Contexts/ApiClientContext';

type RenderCallback = (props: RouteComponentProps<any>) => React.ReactNode;
type RendererProps = RouteComponentProps<any> & RouteProps;

interface IPrivateRouteProps extends RouteProps, IApiClientAware {
}

const PrivateRouteComponent: React.FC<IPrivateRouteProps> = ({component, render, client, ...routeProps}) => {
	const doRender = (Component?: React.ComponentType, renderCallback?: RenderCallback) => (props: RendererProps) => {
		if (!Component && !renderCallback)
			return null;

		if (client.isAuthenticated())
			return Component ? <Component {...props} /> : renderCallback(props);

		return (
			<Redirect
				to={{
					pathname: '/login',
					state: {
						from: props.location,
					},
				}}
			/>
		);
	};

	return <Route {...routeProps} render={doRender(component, render)} />;
};

export const PrivateRoute = withApiClient(PrivateRouteComponent);
