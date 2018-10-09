import {Entity} from './Entity';
import {Item} from './Item';
import {Skill} from './Skill';

interface AilmentRecoveryFields {
	actions: string[];
	items: Item[];
}

export type AilmentRecovery = Partial<AilmentRecoveryFields>;

interface AilmentProtectionFields {
	items: Item[];
	skills: Pick<Skill, 'id' | 'name' | 'description'>[];
}

export type AilmentProtection = Partial<AilmentProtectionFields>;

interface AilmentFields extends Entity {
	name: string;
	description: string;
	recovery: AilmentRecovery;
	protection: AilmentProtection;
}

export type Ailment = Partial<AilmentFields>;

export const assertAilment = (value: unknown): value is Ailment => true;
export const assertAilmentArray = (value: unknown): value is Ailment[] => typeof value === 'object' && value.constructor === Array;