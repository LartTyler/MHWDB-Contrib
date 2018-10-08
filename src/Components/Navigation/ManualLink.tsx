import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

interface ManualLinkProps extends RouteComponentProps<{}> {
	to: string;
	className?: string;
}

const ManualLinkComponent: React.SFC<ManualLinkProps> = props => (
	<span className={props.className} onClick={() => props.history.push(props.to)}>
		{props.children}
	</span>
);

export const ManualLink = withRouter(ManualLinkComponent);