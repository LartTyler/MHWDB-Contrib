import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import * as React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {App} from './Components/App';
import {Login} from './Components/Auth/Login';
import {PrivateRoute} from './Security/PrivateRoute';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

export const Router: React.SFC<{}> = () => (
	<MuiThemeProvider theme={theme}>
		<CssBaseline />

		<BrowserRouter>
			<Switch>
				<Route exact={true} path="/login" component={Login} />

				<PrivateRoute path="/" component={App} />
			</Switch>
		</BrowserRouter>
	</MuiThemeProvider>
);