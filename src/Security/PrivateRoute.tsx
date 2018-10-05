import * as React from 'react';
import {Redirect, Route, RouteComponentProps, RouteProps} from 'react-router';
import {ApiClient} from '../Api';

type RenderCallback = (props: RouteComponentProps<any>) => React.ReactNode;
type RendererProps = RouteComponentProps<any> & RouteProps;

export const PrivateRoute: React.SFC<RouteProps> = ({component, render, ...routeProps}) => {
	const doRender = (Component?: React.ComponentType, render?: RenderCallback) => (props: RendererProps) => {
		if (!Component && !render)
			return null;

		if (ApiClient.isAuthenticated())
			return Component ? <Component {...props} /> : render(props);

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