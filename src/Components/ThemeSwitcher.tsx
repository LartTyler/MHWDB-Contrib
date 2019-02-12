import {Button} from '@blueprintjs/core';
import * as React from 'react';
import {
	IThemeAware,
	IThemeMutatorAware,
	Theme,
	ThemeMutatorCallback,
	withTheme,
	withThemeMutator,
} from './Contexts/ThemeContext';
import './ThemeSwitcher.scss';

const onThemeToggle = (currentTheme: Theme, callback: ThemeMutatorCallback) => {
	const nextTheme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;

	callback(nextTheme);
};

interface IThemeSwitcherProps extends IThemeAware, IThemeMutatorAware {
}

const ThemeSwitcherComponent: React.FC<IThemeSwitcherProps> = props => (
	<Button
		icon={props.theme === Theme.DARK ? 'flash' : 'moon'}
		minimal={true}
		onClick={() => onThemeToggle(props.theme, props.onThemeChange)}
	/>
);

export const ThemeSwitcher = withTheme(withThemeMutator(ThemeSwitcherComponent));
