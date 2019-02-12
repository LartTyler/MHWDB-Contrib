import {Classes, H2} from '@blueprintjs/core';
import * as React from 'react';
import {ContentContainer} from './ContentContainer';

export const Home: React.FC<{}> = () => (
	<ContentContainer>
		<H2>Welcome!</H2>

		<div className={Classes.RUNNING_TEXT}>
			<p>
				As the MHWDB project has grown and more features have been added, it's become apparent that the original
				method of scraping fan sites and wikis for information is too inconsistent to rely on. Since every site
				formats information differently (and most allow any user to edit, which is great, but prone to human
				error), scraping has caused previously fixed inaccuracies (such as the "Fire and Ice" dual blades only
				having one of it's elements) to be re-introduced.
			</p>

			<p>
				To that end, this site will allow you to make changes to the database objects that back the API. All
				changes will be reflected in real-time, though this is subject to change in the future as I'd like to
				add a review system of sorts eventually. <strong>To get started,</strong> use the "Contribute" button
				in the top left of the page.
			</p>

			<p>
				As always, THANK YOU to all that help contribute to the project through this site, as well as everyone
				who has submitted bug reports, feature requests, and offered their suggestions since the project
				launched.
			</p>
		</div>
	</ContentContainer>
);
