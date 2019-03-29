import {NonIdealState} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import './PageNotFound.scss';

export const PageNotFound: React.FC<{}> = () => {
	const description = (
		<span>
			<p>The page you requested could not be found. </p>

			<p><Link to="/">Click here</Link> to return to the home page.</p>
		</span>
	);

	return (
		<div id="page-not-found-component">
			<NonIdealState icon="help" title="Page not found" description={description} />
		</div>
	);
};
