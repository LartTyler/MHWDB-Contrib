import {Entity} from './Entity';

export interface SkillRank extends Entity {
	skill: number;
	skillName: string;
	level: number;
	description: string;
	modifiers: {[key: string]: string | number | boolean};
}

export interface Skill extends Entity{
	name: string;
	description: string;
	ranks: SkillRank[];
}