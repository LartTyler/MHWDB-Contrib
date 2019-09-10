import * as React from 'react';
import {AttributeName} from '../../../../Api/Models/attributes';
import {IAttributeDialogProps} from '../AttributesEditor';
import {AffinityDialog} from './AffinityDialog';
import {AmmoCapacitiesDialog} from './AmmoCapacitiesDialog';
import {BoostTypeDialog} from './BoostTypeDialog';
import {CoatingsDialog} from './CoatingsDialog';
import {DamageTypeDialog} from './DamageTypeDialog';
import {DefenseDialog} from './DefenseDialog';
import {DeviationDialog} from './DeviationDialog';
import {RequiredGenderDialog} from './RequiredGenderDialog';
import {ShellingTypeDialog} from './ShellingTypeDialog';
import {SpecialAmmoDialog} from './SpecialAmmoDialog';

type DialogMap = {
	[P in AttributeName]?: React.ComponentType<IAttributeDialogProps<any>>;
};

export const dialogs: DialogMap = {
	[AttributeName.AFFINITY]: AffinityDialog,
	[AttributeName.AMMO_CAPACITIES]: AmmoCapacitiesDialog,
	[AttributeName.COATINGS]: CoatingsDialog,
	[AttributeName.DAMAGE_TYPE]: DamageTypeDialog,
	[AttributeName.DEFENSE]: DefenseDialog,
	[AttributeName.DEVIATION]: DeviationDialog,
	[AttributeName.GENDER]: RequiredGenderDialog,
	[AttributeName.GL_SHELLING_TYPE]: ShellingTypeDialog,
	[AttributeName.IG_BOOST_TYPE]: BoostTypeDialog,
	[AttributeName.SPECIAL_AMMO]: SpecialAmmoDialog,
};
