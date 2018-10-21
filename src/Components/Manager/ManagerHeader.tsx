import {H2} from '@blueprintjs/core';
import * as React from 'react';

interface IManagerHeaderProps {
	/**
	 * The header's title text.
	 */
	title: string;

	/**
	 * A component to place in the header's refresh button slot, directly to the right of the title text.
	 *
	 * If this prop is not provided, a refresh button will not be rendered.
	 */
	refresh?: React.ReactNode;

	/**
	 * A component to use for the header's search bar.
	 *
	 * If this prop is not provided, a search bar will not be rendered.
	 */
	search?: React.ReactNode;
}

export const ManagerHeader: React.SFC<IManagerHeaderProps> = props => (
	<div className="manager-header-component" style={{display: 'flex'}}>
		<div style={{flex: 2}}>
			<H2>
				{props.title}

				{props.refresh}
			</H2>
		</div>

		<div style={{flex: 1}}>
			{props.search}
		</div>
	</div>
);
