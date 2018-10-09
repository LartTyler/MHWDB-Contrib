import {Icon} from '@blueprintjs/core';
import * as React from 'react';
import {
	Theme,
	ThemeAware,
	ThemeMutatorAware,
	ThemeMutatorCallback,
	withThemeContext,
	withThemeMutatorContext,
} from './Contexts/ThemeContext';
import './ThemeSwitcher.scss';

const onThemeToggle = (currentTheme: Theme, callback: ThemeMutatorCallback) => {
	const nextTheme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;

	callback(nextTheme);
};

interface ThemeSwitcherProps extends ThemeAware, ThemeMutatorAware {
}

const ThemeSwitcherComponent: React.SFC<ThemeSwitcherProps> = props => (
	<div id="theme-switcher-component" onClick={() => onThemeToggle(props.theme, props.onThemeChange)}>
		<Icon icon={props.theme === Theme.DARK ? 'flash' : 'moon'} />
	</div>
);

export const ThemeSwitcher = withThemeContext(withThemeMutatorContext(ThemeSwitcherComponent));