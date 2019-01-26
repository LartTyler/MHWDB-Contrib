import {FormGroup, IFormGroupProps, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {IConstraintViolations} from '../Api/Error';

interface IProps extends IFormGroupProps {
	labelFor: string;
	violations: IConstraintViolations;
}

export const ValidationAwareFormGroup: React.FC<IProps> = ({violations, ...props}) => {
	if (violations && props.labelFor in violations) {
		props.helperText = violations[props.labelFor].message;
		props.intent = Intent.DANGER;
	}

	return (
		<FormGroup {...props} />
	);
};
