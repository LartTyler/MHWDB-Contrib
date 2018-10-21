import {IEntity} from './Entity';

export interface Item extends IEntity {
	name: string;
	description: string;
	rarity: number;
	carryLimit: number;
	value: number;
}