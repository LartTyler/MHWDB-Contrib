import {IMenuItemProps, MenuItem} from '@blueprintjs/core';
import * as React from 'react';
import {history} from '../../history';

interface IProps extends IMenuItemProps {
	href: string;
}

/**
 * A BlueprintJS menu item component that uses React Router instead of allowing the browser to handle it's anchor tag.
 *
 * @param {IProps & {children?: React.ReactNode}} props
 * @returns {JSX.Element}
 * @constructor
 */
export const LinkedMenuItem: React.FC<IProps> = props => {
	const {href, onClick, ...rest} = props;

	return (
		<MenuItem
			{...rest}
			onClick={<T extends HTMLElement>(event: React.MouseEvent<T>) => {
				if (onClick)
					onClick(event);

				history.push(href);
			}}
		/>
	);
};
