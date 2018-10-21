import {IMenuItemProps, MenuItem} from '@blueprintjs/core';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

interface ILinkedMenuItemProps extends IMenuItemProps, RouteComponentProps<{}> {
	href: string;
}

/**
 * A BlueprintJS menu item component that uses React Router instead of allowing the browser to handle it's anchor tag.
 *
 * @param {ILinkedMenuItemProps & {children?: React.ReactNode}} props
 * @returns {JSX.Element}
 * @constructor
 */
const LinkedMenuItemComponent: React.SFC<ILinkedMenuItemProps> = props => {
	// The extra de-referenced properties MUST be included, since they need to be extracted and not passed up to the
	// enclosing MenuItem component.
	const {history, location, match, staticContext, ...rest} = props;

	return (
		<MenuItem
			onClick={<T extends HTMLElement>(event: React.MouseEvent<T>) => {
				if (props.onClick)
					props.onClick(event);

				event.preventDefault();
				event.stopPropagation();

				history.push(props.href);
			}}
			{...rest}
		/>
	);
};

export const LinkedMenuItem = withRouter(LinkedMenuItemComponent);