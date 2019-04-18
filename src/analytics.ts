import * as ReactGA from 'react-ga';
import {history} from './history';

export class Analytics {
	protected static initialized: boolean = false;

	public static pageview(page: string): void {
		if (!Analytics.initialized)
			return;

		ReactGA.pageview(page);
	}

	public static modalview(modal: string): void {
		if (!Analytics.initialized)
			return;

		ReactGA.modalview(modal);
	}

	public static initialize(gaCode: string): void {
		if (Analytics.initialized)
			return;

		ReactGA.initialize(gaCode);
		Analytics.initialized = true;

		history.listen(location => {
			Analytics.pageview(location.pathname);
		});
	}
}

// @ts-ignore
if (process.env.NODE_ENV === 'production' && process.env.GA_CODE) {
	// @ts-ignore
	Analytics.initialize(process.env.GA_CODE);

	Analytics.pageview(history.location.pathname);
}
