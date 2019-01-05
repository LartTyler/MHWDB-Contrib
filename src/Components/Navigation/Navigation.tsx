import {Alignment, Button, Navbar, NavbarDivider, NavbarGroup, NavbarHeading} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Logout} from '../Auth/Logout';
import {ThemeSwitcher} from '../ThemeSwitcher';
import {ContributeButton} from './ContributeButton';

export const Navigation: React.FC<{}> = () => (
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

		<NavbarGroup align={Alignment.RIGHT}>
			<div style={{marginRight: 5}}>
				<ThemeSwitcher />
			</div>

			<NavbarDivider />

			<Logout>
				<Button minimal={true}>
					Logout
				</Button>
			</Logout>
		</NavbarGroup>

	</Navbar>
);
