import {Entity} from './Entity';

export interface Item extends Entity {
	name?: string;
	description?: string;
	rarity?: number;
	carryLimit?: number;
	value?: number;
}