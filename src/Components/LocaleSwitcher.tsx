import * as React from 'react';
import {Select} from '@dbstudios/blueprintjs-components';
import {Locale, setApiLocale} from '../Api/client';

const STORAGE_KEY = 'locale';

const localeText: { [key: string]: string } = {
	[Locale.ENGLISH]: 'English',
	[Locale.FRENCH]: 'French',
	[Locale.GERMAN]: 'German',
	[Locale.CHINESE_SIMPLIFIED]: 'Chinese (Simplified)',
	[Locale.CHINESE_TRADITIONAL]: 'Chinese (Traditional)',
};

const isLocale = (value: any): value is Locale => typeof value === 'string' && value in localeText;

export const LocaleSwitcher: React.FC = () => {
	let value = window.localStorage.getItem(STORAGE_KEY);

	if (value === null || !isLocale(value)) {
		value = Locale.ENGLISH;

		window.localStorage.setItem(STORAGE_KEY, value);
	}

	const [locale, setLocale] = React.useState(value as Locale);
	setApiLocale(locale);

	React.useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, locale);

		setApiLocale(locale);
	}, [locale]);

	return (
		<Select
			filterable={false}
			items={Object.values(Locale)}
			itemTextRenderer={value => localeText[value as string] || 'Unknown'}
			noItemSelected={localeText[locale]}
			onItemSelect={setLocale}
			selected={locale}
			buttonProps={{
				minimal: true,
				rightIcon: 'caret-down',
			}}
		/>
	);
};
