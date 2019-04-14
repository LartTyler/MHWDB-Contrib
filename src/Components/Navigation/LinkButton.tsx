import {Button, IButtonProps} from '@blueprintjs/core';
import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {Omit} from 'utility-types';

interface ILinkButtonProps {
	to: string;

	buttonProps?: IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
	linkProps?: Omit<LinkProps, 'to'>;
}

export const LinkButton: React.FC<ILinkButtonProps> = props => (
	<Link to={props.to} {...props.linkProps} className={props.linkProps.className || 'plain-link'}>
		<Button {...props.buttonProps}>
			{props.children}
		</Button>
	</Link>
);

LinkButton.defaultProps = {
	buttonProps: {},
	linkProps: {},
};
