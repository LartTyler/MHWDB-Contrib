import {Classes} from '@blueprintjs/core';
import * as React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import {App} from './Components/App';
import {isThemeName, Theme, ThemeContext, ThemeMutatorContext} from './Components/Contexts/ThemeContext';
import {history} from './history';
import './Layout.scss';

const THEME_NAME_KEY = 'ui.theme_name';

interface ILayoutState {
	theme: Theme;
}

export class Layout extends React.Component<{}, ILayoutState> {
	public constructor(props: {}) {
		super(props);

		const themeValue = window.localStorage.getItem(THEME_NAME_KEY) || Theme.DARK;
		let theme: Theme;

		if (!isThemeName(themeValue)) {
			theme = Theme.DARK;

			window.localStorage.setItem(THEME_NAME_KEY, theme);
		} else
			theme = themeValue;

		this.state = {
			theme,
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
						<Router history={history}>
							<Switch>
								<Route path="/" component={App} />
							</Switch>
						</Router>
					</ThemeMutatorContext.Provider>
				</ThemeContext.Provider>
			</div>
		);
	}

	private onThemeChange = (theme: Theme) => {
		window.localStorage.setItem(THEME_NAME_KEY, theme);

		this.setState({
			theme,
		});
	};
}
