import * as React from 'react';
import {logout} from '../../Api/client';
import {toaster} from '../Contexts/ToasterContext';

export const Logout: React.FC<{}> = props => (
	<div
		onClick={() => {
			logout();

			toaster.show({
				message: 'You have been logged out.',
			});
		}}
	>
		{props.children}
	</div>
);
