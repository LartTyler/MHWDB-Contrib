import * as React from 'react';
import {Subtract} from 'utility-types';
import {ApiClient} from '../../_Api/ApiClient';

export const client = new ApiClient(process.env.API_URL);

export const ApiClientContext = React.createContext(client);

export interface IApiClientAware {
	client: ApiClient;
}

export const withApiClient = <P extends IApiClientAware>(Component: React.ComponentType<P>):
	React.ComponentType<Subtract<P, IApiClientAware>> => props => (
	<ApiClientContext.Consumer>
			{value => <Component {...props} client={value} />}
		</ApiClientContext.Consumer>
);
