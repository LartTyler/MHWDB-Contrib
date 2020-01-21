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
	PopoverPosition,
} from '@blueprintjs/core';
import * as React from 'react';
import {GoMarkGithub} from 'react-icons/go';
import {Link} from 'react-router-dom';
import {isUserAuthenticated, Locale, logout, tokenStore} from '../../Api/client';
import {ThemeSwitcher} from '../ThemeSwitcher';
import {ContributeButton} from './ContributeButton';
import {LinkButton} from './LinkButton';
import {Select} from '@dbstudios/blueprintjs-components';

const localeText: { [key: string]: string } = {
	[Locale.ENGLISH]: 'English',
	[Locale.FRENCH]: 'French',
	[Locale.GERMAN]: 'German',
	[Locale.CHINESE_SIMPLIFIED]: 'Chinese (Simplified)',
	[Locale.CHINESE_TRADITIONAL]: 'Chinese (Traditional)',
};

interface IProps {
	locale: Locale;
	onLocaleChange: (locale: Locale) => void;
}

export const Navigation: React.FC<IProps> = props => (
	<Navbar fixedToTop={true}>
		<NavbarGroup align={Alignment.LEFT}>
			<NavbarHeading>
				<Link to="/" className="plain-link">
					Monster Hunter: World DB
				</Link>
			</NavbarHeading>

			<NavbarDivider />

			<ContributeButton />

			<LinkButton buttonProps={{minimal: true}} to="/events">
				Events
			</LinkButton>
		</NavbarGroup>

		<NavbarGroup align={Alignment.RIGHT}>
			<div style={{marginRight: 5}}>
				<Select
					filterable={false}
					items={Object.values(Locale)}
					itemTextRenderer={value => localeText[value as string] || 'Unknown'}
					noItemSelected={localeText[props.locale]}
					onItemSelect={props.onLocaleChange}
					selected={props.locale}
					buttonProps={{
						minimal: true,
						rightIcon: 'caret-down',
					}}
				/>
			</div>

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

			{isUserAuthenticated() ? (
				<>
					<Popover position={PopoverPosition.BOTTOM}>
						<Button minimal={true} rightIcon="caret-down">
							{tokenStore.getToken().body.displayName}
						</Button>

						<Menu>
							<MenuItem onClick={logout} text="Log Out" />
						</Menu>
					</Popover>
				</>
			) : (
				<LinkButton buttonProps={{minimal: true}} to="/login">
					Log In
				</LinkButton>
			)}
		</NavbarGroup>

	</Navbar>
);
