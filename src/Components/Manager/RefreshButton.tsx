import {Classes, Icon} from '@blueprintjs/core';
import * as React from 'react';

interface IRefreshButtonProps {
	/**
	 * A callback to invoke when the refresh button is clicked.
	 */
	onRefresh: () => void;
}

export const RefreshButton: React.FC<IRefreshButtonProps> = props => (
	<small className={Classes.TEXT_MUTED} style={{marginLeft: 10, cursor: 'pointer'}} onClick={props.onRefresh}>
		<Icon icon="refresh" />
	</small>
);
