import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.scss';
import {Login} from './Auth/Login';
import {PasswordReset} from './Auth/PasswordReset';
import {UserActivation} from './Auth/UserActivation';
import {Editors} from './Editors';
import {Home} from './Home';
import {Navigation} from './Navigation/Navigation';
import {PageNotFound} from './PageNotFound';
import {WorldEvents} from './WorldEvents/WorldEvents';
import {Locale, setApiLocale} from '../Api/client';

const STORAGE_KEY = 'locale';

const localeText: { [key: string]: string } = {
	[Locale.ENGLISH]: 'English',
	[Locale.FRENCH]: 'French',
	[Locale.GERMAN]: 'German',
	[Locale.CHINESE_SIMPLIFIED]: 'Chinese (Simplified)',
	[Locale.CHINESE_TRADITIONAL]: 'Chinese (Traditional)',
};

const isLocale = (value: any): value is Locale => typeof value === 'string' && value in localeText;

export const App: React.FC = () => {
	let value = window.localStorage.getItem(STORAGE_KEY);

	if (value === null || !isLocale(value)) {
		value = Locale.ENGLISH;

		window.localStorage.setItem(STORAGE_KEY, value);
	}

	const [locale, setLocale] = React.useState(value as Locale);
	setApiLocale(locale);

	React.useEffect(() => {
		if (window.localStorage.getItem(STORAGE_KEY) === locale)
			return;

		window.localStorage.setItem(STORAGE_KEY, locale);

		setApiLocale(locale);

		window.location.reload();
	}, [locale]);

	return (
		<>
			<div id="app-navigation">
				<Navigation locale={locale} onLocaleChange={setLocale} />
			</div>

			<div id="app-content">
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/password-reset/:code" component={PasswordReset} />
					<Route path="/activate/:code" component={UserActivation} />

					<Route path="/" exact={true} component={Home} />
					<Route path="/events" exact={true} component={WorldEvents} />
					<Route path="/objects" component={Editors} />

					<Route component={PageNotFound} />
				</Switch>
			</div>
		</>
	);
};
