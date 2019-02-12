import {
	Alignment,
	Button,
	Menu,
	MenuDivider,
	MenuItem,
	Navbar,
	NavbarDivider,
	NavbarGroup,
	NavbarHeading,
	Popover,
} from '@blueprintjs/core';
import * as React from 'react';
import {GoMarkGithub} from 'react-icons/go';
import {Link} from 'react-router-dom';
import {Logout} from '../Auth/Logout';
import {ThemeSwitcher} from '../ThemeSwitcher';
import {ContributeButton} from './ContributeButton';

export const Navigation: React.FC<{}> = () => (
	<Navbar fixedToTop={true}>
		<NavbarGroup align={Alignment.LEFT}>
			<NavbarHeading>
				<Link to="/" className="plain-link">
					Monster Hunter: World DB
				</Link>
			</NavbarHeading>

			<NavbarDivider />

			<ContributeButton />
		</NavbarGroup>

		<NavbarGroup align={Alignment.RIGHT}>
			<Popover>
				<Button icon={<GoMarkGithub size={16} />} minimal={true} style={{marginRight: 5}} />

				<Menu>
					<MenuDivider title="Visit us on GitHub!" />
					<MenuItem href="https://github.com/LartTyler/MHWDB-API" text="API" />
					<MenuItem href="https://github.com/LartTyler/MHWDB-Docs/issues" text="Issues / Suggestions" />
					<MenuItem href="https://github.com/LartTyler/MHWDB-Contrib" text="Contrib (this site)" />

					<MenuDivider />

					<MenuItem href="https://docs.mhw-db.com" text="API Documentation" />
				</Menu>
			</Popover>

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
