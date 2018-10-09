import {Classes} from '@blueprintjs/core';
import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {App} from './Components/App';
import {Login} from './Components/Auth/Login';
import {isThemeName, Theme, ThemeContext, ThemeMutatorContext} from './Components/Contexts/ThemeContext';
import {toaster, ToasterContext} from './Components/Contexts/ToasterContext';
import './Layout.scss';
import {PrivateRoute} from './Security/PrivateRoute';

const THEME_NAME_KEY = 'ui.theme_name';

interface LayoutState {
	theme: Theme;
}

export class Layout extends React.Component<{}, LayoutState> {
	private onThemeChange = (theme: Theme) => {
		window.localStorage.setItem(THEME_NAME_KEY, theme);

		this.setState({
			theme: theme,
		});
	};

	public constructor(props: {}) {
		super(props);

		const themeValue = window.localStorage.getItem(THEME_NAME_KEY) || Theme.DARK;
		let theme: Theme;

		if (!isThemeName(themeValue)) {
			console.warn(`${themeValue} is not a recognized theme`);

			theme = Theme.DARK;

			window.localStorage.setItem(THEME_NAME_KEY, theme);
		} else
			theme = themeValue;

		this.state = {
			theme: theme,
		};
	}

	public render(): JSX.Element {
		const rootClasses = [];

		if (this.state.theme === Theme.DARK)
			rootClasses.push(Classes.DARK);

		return (
			<div id="app-root" className={rootClasses.join(' ')}>
				<ThemeContext.Provider value={this.state.theme}>
					<ThemeMutatorContext.Provider value={this.onThemeChange}>
						<ToasterContext.Provider value={toaster}>
							<BrowserRouter>
								<Switch>
									<Route path="/login" component={Login} />

									<PrivateRoute path="/" component={App} />
								</Switch>
							</BrowserRouter>
						</ToasterContext.Provider>
					</ThemeMutatorContext.Provider>
				</ThemeContext.Provider>
			</div>
		);
	}
}