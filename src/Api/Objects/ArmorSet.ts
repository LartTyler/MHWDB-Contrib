import {ApiClient} from '../ApiClient';
import {AbstractApiClientModule} from '../Module';
import {IArmor} from './Armor';
import {IEntity, Rank} from './Entity';
import {ISkill} from './Skill';

export interface IArmorSetBonusRank {
	pieces?: number;
	skill?: ISkill;
}

export interface IArmorSetBonus extends IEntity {
	name?: string;
	ranks?: IArmorSetBonusRank[];
}

export interface IArmorSet extends IEntity {
	name?: string;
	rank?: Rank;
	pieces?: IArmor[];
	bonus?: IArmorSetBonus;
}

export class ArmorSetApiClientModule extends AbstractApiClientModule<IArmorSet> {
	public constructor(client: ApiClient) {
		super(client, '/armor/sets');
	}
}
