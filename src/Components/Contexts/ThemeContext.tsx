import * as React from 'react';
import {Subtract} from 'utility-types';

export enum Theme {
	DARK = 'dark',
	LIGHT = 'light',
}

export const isThemeName = (value: unknown): value is Theme => typeof value === 'string' && value.toUpperCase() in Theme;

export const ThemeContext = React.createContext(Theme.DARK);

export interface ThemeAware {
	theme: Theme;
}

export const withThemeContext = <P extends ThemeAware>(Component: React.ComponentType<P>): React.ComponentType<Subtract<P, ThemeAware>> => props => (
	<ThemeContext.Consumer>
		{theme => <Component theme={theme} {...props} />}
	</ThemeContext.Consumer>
);

export type ThemeMutatorCallback = (theme: Theme) => void;

export const ThemeMutatorContext = React.createContext((theme: Theme): void => {
	throw new Error('Theme mutator context has no value!');
});

export interface ThemeMutatorAware {
	onThemeChange: ThemeMutatorCallback;
}

export const withThemeMutatorContext = <P extends ThemeMutatorAware>(Component: React.ComponentType<P>): React.ComponentType<Subtract<P, ThemeMutatorAware>> => props => (
	<ThemeMutatorContext.Consumer>
		{onThemeChange => <Component onThemeChange={onThemeChange} {...props} />}
	</ThemeMutatorContext.Consumer>
);
