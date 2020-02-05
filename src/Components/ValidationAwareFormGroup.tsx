import {FormGroup, IFormGroupProps, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {IValidationFailures} from '../Api/Error';

interface IProps extends IFormGroupProps {
	labelFor: string;
	violations: IValidationFailures;
}

export const ValidationAwareFormGroup: React.FC<IProps> = ({violations, ...props}) => {
	if (violations) {
		if (props.labelFor in violations) {
			props.helperText = violations[props.labelFor].message;
			props.intent = Intent.DANGER;
		} else {
			for (let key in violations) {
				if (!violations.hasOwnProperty(key))
					continue;

				// Fix for strings objects on localized entities
				const path = key.replace(/strings\[\d+\]\./, '');

				if (path.indexOf(props.labelFor) === 0) {
					props.helperText = violations[key].message;
					props.intent = Intent.DANGER;

					break;
				}
			}
		}
	}

	return (
		<FormGroup {...props} />
	);
};
