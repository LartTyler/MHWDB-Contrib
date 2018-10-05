import {Entity} from './Entity';
import {Item} from './Item';
import {Skill} from './Skill';

export interface AilmentRecovery {
	actions?: string[];
	items?: Item[];
}

export interface AilmentProtection {
	items?: Item[];
	skills?: Pick<Skill, 'id' | 'name' | 'description'>[];
}

export interface Ailment extends Entity {
	name?: string;
	description?: string;
	recovery?: AilmentRecovery;
	protection?: AilmentProtection;
}