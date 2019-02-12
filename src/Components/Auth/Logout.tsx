import {Intent} from '@blueprintjs/core';
import * as React from 'react';
import {logout} from '../../Api/client';
import {toaster} from '../../toaster';

export const Logout: React.FC<{}> = props => (
	<div
		onClick={() => {
			logout();

			toaster.show({
				intent: Intent.PRIMARY,
				message: 'You have been logged out.',
			});
		}}
	>
		{props.children}
	</div>
);
