import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import {ApiClient} from '../Api';

export const PrivateRoute: React.SFC<RouteProps> = ({component, ...routeProps}) => {
	const render = (Component?: React.ComponentType) => (props: RouteProps) => {
		if (!Component)
			return null;

		if (ApiClient.isAuthenticated())
			return <Component {...props} />;

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

	return <Route {...routeProps} render={render(component)} />;
};