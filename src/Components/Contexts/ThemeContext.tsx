import * as React from 'react';
import {Subtract} from 'utility-types';

export enum Theme {
	DARK = 'dark',
	LIGHT = 'light',
}

export const isThemeName = (value: unknown): value is Theme =>
	Object.values(Theme).indexOf(value) !== -1;

export const ThemeContext = React.createContext(Theme.DARK);

export interface IThemeAware {
	theme: Theme;
}

export const withTheme = <P extends IThemeAware>(Component: React.ComponentType<P>):
	React.ComponentType<Subtract<P, IThemeAware>> => props => (
		<ThemeContext.Consumer>
			{theme => <Component theme={theme} {...props} />}
		</ThemeContext.Consumer>
	);

export type ThemeMutatorCallback = (theme: Theme) => void;

export const ThemeMutatorContext = React.createContext((theme: Theme): void => {
	throw new Error('Theme mutator context has no value!');
});

export interface IThemeMutatorAware {
	onThemeChange: ThemeMutatorCallback;
}

export const withThemeMutator = <P extends IThemeMutatorAware>(Component: React.ComponentType<P>):
	React.ComponentType<Subtract<P, IThemeMutatorAware>> => props => (
		<ThemeMutatorContext.Consumer>
			{onThemeChange => <Component onThemeChange={onThemeChange} {...props} />}
		</ThemeMutatorContext.Consumer>
	);
