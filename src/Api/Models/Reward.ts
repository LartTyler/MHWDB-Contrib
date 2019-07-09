import {Omit} from 'utility-types';
import {Rank} from '../Model';

export enum RewardConditionType {
	CARVE = 'carve',
	INVESTIGATION = 'investigation',
	MINING = 'mining',
	PALICO = 'palico',
	PLUNDERBLADE = 'plunderblade',
	REWARD = 'reward',
	SIEGE_REWARD = 'siege reward',
	SHINY = 'shiny',
	TRACK = 'track',
	WOUND = 'wound',
}

interface IRewardCondition {
	chance: number;
	quantity: number;
	rank: Rank;
	subtype: string;
	type: RewardConditionType;
}

export type RewardCondition = Partial<IRewardCondition>;
export type RewardConditionPayload = Omit<IRewardCondition, 'subtype'> & {
	subtype?: string;
};
