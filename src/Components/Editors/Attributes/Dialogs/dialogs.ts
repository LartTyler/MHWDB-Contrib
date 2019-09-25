import * as React from 'react';
import {AttributeName} from '../../../../Api/Models/attributes';
import {IAttributeDialogProps} from '../AttributesEditor';
import {AffinityDialog} from './AffinityDialog';
import {DamageTypeDialog} from './DamageTypeDialog';
import {DefenseDialog} from './DefenseDialog';
import {RequiredGenderDialog} from './RequiredGenderDialog';
import {ShellingTypeDialog} from './ShellingTypeDialog';

type DialogMap = {
	[P in AttributeName]?: React.ComponentType<IAttributeDialogProps<any>>;
};

export const dialogs: DialogMap = {
	[AttributeName.AFFINITY]: AffinityDialog,
	[AttributeName.DAMAGE_TYPE]: DamageTypeDialog,
	[AttributeName.DEFENSE]: DefenseDialog,
	[AttributeName.GENDER]: RequiredGenderDialog,
	[AttributeName.GL_SHELLING_TYPE]: ShellingTypeDialog,
};
