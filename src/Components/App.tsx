import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, {WithStyles} from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography';
import FileDocumentBoxIcon from 'mdi-material-ui/FileDocumentBox';
import GithubCircleIcon from 'mdi-material-ui/GithubCircle';
import * as React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {LogoutButton} from './Auth/LogoutButton';
import {AilmentEditor} from './Editor/AilmentEditor';
import {Home} from './Home';
import {NavList} from './Navigation/NavList';
import {NavListLink} from './Navigation/NavListLink';
import {PaletteType, ThemeSwitcher} from './ThemeSwitcher';

const styles = (theme: Theme) => createStyles({
	root: {
		flexGrow: 1,
		height: '100%',
		minHeight: '100vh',
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawerPaper: {
		position: 'relative',
		width: 240,
	},
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3,
		minWidth: 0,
		flex: '1 1 100%',
	},
	grow: {
		flexGrow: 1,
	},
});

interface AppProps extends WithStyles<typeof styles> {
	onThemeChange: (paletteType: PaletteType) => void;
	currentTheme: PaletteType;
}

const AppComponent: React.SFC<AppProps> = props => {
	const {classes} = props;

	return (
		<div className={classes.root}>
			<AppBar position="absolute" className={classes.appBar}>
				<Toolbar>
					<Typography variant="title" color="inherit" noWrap={true} className={classes.grow}>
						<Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
							Monster Hunter: World DB
						</Link>
					</Typography>

					<ThemeSwitcher onChange={props.onThemeChange} paletteType={props.currentTheme} />

					<Tooltip title="Visit us on GitHub">
						<a href="https://github.com/LartTyler/MHWDB-API" target="_blank">
							<IconButton>
								<GithubCircleIcon />
							</IconButton>
						</a>
					</Tooltip>

					<Tooltip title="View the docs">
						<a href="https://docs.mhw-db.com" target="_blank">
							<IconButton>
								<FileDocumentBoxIcon />
							</IconButton>
						</a>
					</Tooltip>

					<LogoutButton />
				</Toolbar>
			</AppBar>

			<Drawer variant="permanent" classes={{paper: classes.drawerPaper}}>
				<div className={classes.toolbar} />

				<NavList>
					<NavListLink linkTo="/">
						Home
					</NavListLink>

					<NavListLink linkTo="/edit/ailments">
						Ailments
					</NavListLink>
				</NavList>
			</Drawer>

			<main className={classes.content}>
				<div className={classes.toolbar} />

				<Switch>
					<Route exact={true} path="/" component={Home} />

					<Route path="/edit/ailments" component={AilmentEditor} />
				</Switch>
			</main>
		</div>
	);
};

export const App = withStyles(styles)(AppComponent);