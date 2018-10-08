import {Alignment, Navbar, NavbarDivider, NavbarGroup, NavbarHeading} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {ContributeButton} from './ContributeButton';

export const Navigation: React.SFC<{}> = () => (
	<Navbar fixedToTop={true}>
		<NavbarGroup align={Alignment.LEFT}>
			<NavbarHeading>
				<Link to="/" className="plain-link">
					Title
				</Link>
			</NavbarHeading>

			<NavbarDivider />

			<ContributeButton />
		</NavbarGroup>
	</Navbar>
);