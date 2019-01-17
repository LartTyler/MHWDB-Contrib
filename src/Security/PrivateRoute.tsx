import * as React from 'react';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router';
import {tokenStore} from '../Api/client';
import {history} from '../history';

type RenderCallback = (props: RouteComponentProps<any>) => React.ReactNode;
type RendererProps = RouteComponentProps<any> & RouteProps;

export const PrivateRoute: React.FC<RouteProps> = ({component, render, ...routeProps}) => {
	const doRender = (Component?: React.ComponentType, renderCallback?: RenderCallback) => (props: RendererProps) => {
		if (!Component && !renderCallback)
			return null;

		if (tokenStore.isAuthenticated())
			return Component ? <Component {...props} /> : renderCallback(props);

		return (
			<Redirect
				to={{
					pathname: '/login',
					state: {
						from: history.location.pathname,
					},
				}}
			/>
		);
	};

	return <Route {...routeProps} render={doRender(component, render)} />;
};
