import {AmmoType} from '../../../../../Api/Models/Weapon';
import {CapacityInputsLevel1, CapacityInputsLevel2, CapacityInputsLevel3, ICapacityInputsProps} from './CapacityInputs';

type CapacityInputsMap = {
	[P in AmmoType]: React.ComponentType<ICapacityInputsProps<any>>;
};

export const capacityInputsMap: CapacityInputsMap = {
	[AmmoType.NORMAL]: CapacityInputsLevel3,
	[AmmoType.PIERCING]: CapacityInputsLevel3,
	[AmmoType.SPREAD]: CapacityInputsLevel3,
	[AmmoType.STICKY]: CapacityInputsLevel3,
	[AmmoType.CLUSTER]: CapacityInputsLevel3,
	[AmmoType.RECOVER]: CapacityInputsLevel2,
	[AmmoType.POISON]: CapacityInputsLevel2,
	[AmmoType.PARALYSIS]: CapacityInputsLevel2,
	[AmmoType.SLEEP]: CapacityInputsLevel2,
	[AmmoType.EXHAUST]: CapacityInputsLevel2,
	[AmmoType.FLAMING]: CapacityInputsLevel1,
	[AmmoType.WATER]: CapacityInputsLevel1,
	[AmmoType.FREEZE]: CapacityInputsLevel1,
	[AmmoType.THUNDER]: CapacityInputsLevel1,
	[AmmoType.DRAGON]: CapacityInputsLevel1,
	[AmmoType.SLICING]: CapacityInputsLevel1,
	[AmmoType.WYVERN]: CapacityInputsLevel1,
	[AmmoType.DEMON]: CapacityInputsLevel1,
	[AmmoType.ARMOR]: CapacityInputsLevel1,
	[AmmoType.TRANQ]: CapacityInputsLevel1,
};
