import {Omit} from 'utility-types';
import {IEntity, ISimpleSkillRank} from '../Model';
import {SkillRank} from './Skill';

interface IDecoration extends IEntity {
	name: string;
	rarity: number;
	slot: number;
	skills: SkillRank[];
}

export type Decoration = Partial<IDecoration>;

export type DecorationPayload = Omit<IDecoration, 'id' | 'skills'> & {
	skills?: ISimpleSkillRank[];
};
