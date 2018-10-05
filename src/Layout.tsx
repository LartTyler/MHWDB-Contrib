import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import createMuiTheme, {Theme} from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {App} from './Components/App';
import {Login} from './Components/Auth/Login';
import {isPaletteType, PaletteType} from './Components/ThemeSwitcher';
import {PrivateRoute} from './Security/PrivateRoute';

const buildMuiTheme = (paletteType: PaletteType) => {
	return createMuiTheme({
		palette: {
			type: paletteType,
		},
	});
};

const uiThemeStorageKey = 'ui.theme_name';

interface ContainerState {
	theme: Theme;
	paletteType: PaletteType;
}

export class Layout extends React.Component<{}, ContainerState> {
	private onThemeChange = (theme: PaletteType) => {
		window.localStorage.setItem(uiThemeStorageKey, theme);

		this.setState({
			paletteType: theme,
			theme: buildMuiTheme(theme),
		});
	};

	public constructor(props: {}) {
		super(props);

		let paletteType = window.localStorage.getItem(uiThemeStorageKey) || 'dark';

		if (!isPaletteType(paletteType)) {
			paletteType = 'dark';

			window.localStorage.setItem(uiThemeStorageKey, paletteType);
		}

		if (!isPaletteType(paletteType)) {
			alert('Could not load theme. Please refresh the page, and try again.');

			window.localStorage.removeItem(uiThemeStorageKey);

			throw new Error('Unknown palette type: ' + paletteType);
		}

		this.state = {
			paletteType: paletteType,
			theme: buildMuiTheme(paletteType),
		};
	}

	public render(): JSX.Element {
		return (
			<MuiThemeProvider theme={this.state.theme}>
				<CssBaseline />

				<BrowserRouter>
					<Switch>
						<Route exact={true} path="/login" component={Login} />

						<PrivateRoute
							path="/"
							render={props => <App
								{...props}
								onThemeChange={this.onThemeChange}
								currentTheme={this.state.paletteType}
							/>}
						/>
					</Switch>
				</BrowserRouter>
			</MuiThemeProvider>
		);
	}
}