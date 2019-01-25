import {CancelToken} from 'axios';
import {Omit} from 'utility-types';
import {client} from '../client';
import {IAttributes, Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';

interface ISkill extends IEntity {
	name: string;
	description: string;
	ranks: SkillRank[];
}

interface ISkillRank extends IEntity {
	level: number;
	description: string;
	skill: number;
	skillName: string;
	modifiers: IAttributes;
}

export type Skill = Partial<ISkill>;
export type SkillRank = Partial<ISkillRank>;

export type SkillPayload = Omit<Skill, 'ranks'> & {
	ranks?: Array<Omit<SkillRank, 'skill' | 'skillName'>>;
};

export class SkillModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/skills', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		});
	}

	public static create(data: SkillPayload, projection?: Projection) {
		return client.put('/skills', data, {
			params: {
				p: projection,
			},
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/skills/:id'>(`/skills/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		});
	}

	public static update(id: Id, data: SkillPayload, projection?: Projection) {
		return client.patch<'/skills/:id'>(`/skills/${id}`, data, {
			params: {
				p: projection,
			},
		});
	}

	public static delete(id: Id) {
		return client.delete<'/skills/:id'>(`/skills/${id}`);
	}
}
