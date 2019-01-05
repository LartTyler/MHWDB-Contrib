import {Button, Classes, Dialog, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {IThemeAware, Theme, withThemeContext} from '../Contexts/ThemeContext';
import {AttributeDropdowns, IAttribute} from './AttributeDropdowns';

export interface IAttributeEditorDialogProps extends IThemeAware {
	attributes: IAttribute[];
	attributeNames: string[];
	isOpen: boolean;
	onAttributeAdd: () => void;
	onAttributeDelete: (attribute: IAttribute) => void;
	onAttributeKeyChange: (attribute: IAttribute, newKey: string) => void;
	onAttributeValueChange: (attribute: IAttribute, newValue: string | number) => void;
	onClose: () => void;

	title?: React.ReactNode;
}

const AttributeEditorDialogComponent: React.FC<IAttributeEditorDialogProps> =
	({isOpen, onClose, theme, title, ...dropdownProps}) => (
		<Dialog
			className={theme === Theme.DARK ? Classes.DARK : ''}
			isOpen={isOpen}
			onClose={onClose}
			title={title}
		>
			<div className={Classes.DIALOG_BODY}>
				<AttributeDropdowns {...dropdownProps} />
			</div>

			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button intent={Intent.PRIMARY} onClick={onClose}>
						Done
					</Button>
				</div>
			</div>
		</Dialog>
	);

AttributeEditorDialogComponent.defaultProps = {
	title: 'Attributes',
};

export const AttributeEditorDialog = withThemeContext(AttributeEditorDialogComponent);
