import {IEntity, Rank} from '../Model';
import {Armor} from './Armor';
import {SkillRank} from './Skill';

interface IArmorSet extends IEntity {
	bonus: ArmorSetBonus;
	name: string;
	pieces: Armor[];
	rank: Rank;
}

interface IArmorSetBonus extends IEntity {
	name: string;
	ranks: ArmorSetBonusRank[];
}

interface IArmorSetBonusRank {
	pieces: number;
	skill: SkillRank;
}

export type ArmorSetBonus = Partial<IArmorSetBonus>;
export type ArmorSetBonusRank = Partial<IArmorSetBonusRank>;
export type ArmorSet = Partial<IArmorSet>;
