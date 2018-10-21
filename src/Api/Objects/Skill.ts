import {IEntity} from './Entity';

export interface SkillRank extends IEntity {
	skill: number;
	skillName: string;
	level: number;
	description: string;
	modifiers: {[key: string]: string | number | boolean};
}

export interface Skill extends IEntity{
	name: string;
	description: string;
	ranks: SkillRank[];
}