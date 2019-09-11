import {FormGroup, IFormGroupProps, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {IConstraintViolations} from '../Api/Error';

interface IProps extends IFormGroupProps {
	labelFor: string;
	violations: IConstraintViolations;
}

export const ValidationAwareFormGroup: React.FC<IProps> = ({violations, ...props}) => {
	if (violations) {
		if (props.labelFor in violations) {
			props.helperText = violations[props.labelFor].message;
			props.intent = Intent.DANGER;
		} else {
			for (const key in violations) {
				if (!violations.hasOwnProperty(key))
					continue;

				if (key.indexOf(props.labelFor) === 0) {
					props.helperText = violations[props.labelFor].message;
					props.intent = Intent.DANGER;

					break;
				}
			}
		}
	}

	if (violations && props.labelFor in violations) {
		props.helperText = violations[props.labelFor].message;
		props.intent = Intent.DANGER;
	}

	return (
		<FormGroup {...props} />
	);
};
