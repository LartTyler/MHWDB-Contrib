import * as React from 'react';
import {AttributeName} from '../../../../Api/Models/attributes';
import {IAttributeDialogProps} from '../AttributesEditor';
import {AffinityDialog} from './AffinityDialog';
import {DefenseDialog} from './DefenseDialog';
import {RequiredGenderDialog} from './RequiredGenderDialog';

type DialogMap = {
	[P in AttributeName]?: React.ComponentType<IAttributeDialogProps<any>>;
};

export const dialogs: DialogMap = {
	[AttributeName.AFFINITY]: AffinityDialog,
	[AttributeName.DEFENSE]: DefenseDialog,
	[AttributeName.GENDER]: RequiredGenderDialog,
};
