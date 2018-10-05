import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import DarkThemeIcon from '@material-ui/icons/Brightness3';
import LightThemeIcon from '@material-ui/icons/BrightnessHigh';
import * as React from 'react';

export type PaletteType = 'dark' | 'light';
export const isPaletteType = (value: string): value is PaletteType => value === 'light' || value === 'dark';

interface ThemeSwitcherProps {
	onChange: (name: PaletteType) => void;
	paletteType: PaletteType;
}

export const ThemeSwitcher: React.SFC<ThemeSwitcherProps> = props => {
	const {paletteType} = props;

	const icon = paletteType === 'dark' ? <LightThemeIcon /> : <DarkThemeIcon />;

	return (
		<div>
			<Tooltip title={`Switch to ${paletteType === 'dark' ? 'light' : 'dark'} theme`}>
				<IconButton onClick={() => props.onChange(paletteType === 'dark' ? 'light' : 'dark')}>
					{icon}
				</IconButton>
			</Tooltip>
		</div>
	);
};