import {Button, ButtonGroup, Classes} from '@blueprintjs/core';
import {ISelectProps, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';

interface IProps<T> extends ISelectProps<T> {
	onClear: () => void;

	readOnly?: boolean;
}

export const ClearableSelect: React.FC<IProps<any>> =
	<T extends any>({onClear, readOnly, popoverProps, ...props}: IProps<T>) => {
		popoverProps = popoverProps || {};
		popoverProps.className = (popoverProps.className || '') + ' full-width';
		popoverProps.targetClassName = (popoverProps.targetClassName || '') + ' full-width';

		return (
			<ButtonGroup fill={true}>
				<Select disabled={readOnly} popoverProps={popoverProps} {...props} />

				{!readOnly && (
					<Button className={Classes.FIXED} icon="cross" onClick={onClear} />
				)}
			</ButtonGroup>
		);
	};

ClearableSelect.defaultProps = {
	readOnly: false,
};
