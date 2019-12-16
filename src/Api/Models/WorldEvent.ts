import {CancelToken} from 'axios';
import {parseIso8601Date} from '../../Utility/date';
import {client} from '../client';
import {Id, IEntity} from '../Model';
import {IQueryDocument, Projection} from '../routes';
import {Location} from './Location';

export enum WorldEventType {
	KULVE_TAROTH = 'kulve taroth siege',
	SAFI_JIIVA = 'safi\'jiiva siege',
	EVENT_QUEST = 'event quest',
	CHALLENGE_QUEST = 'challenge quest',
}

export enum Expansion {
	BASE = 'base',
	ICEBORNE = 'iceborne',
}

export enum Platform {
	CONSOLE = 'console',
	PC = 'pc',
}

export enum PlatformExclusivity {
	PS4 = 'ps4',
}

interface IWorldEvent extends IEntity {
	description: string;
	endTimestamp: Date;
	exclusive: PlatformExclusivity;
	location: Location;
	name: string;
	platform: Platform;
	questRank: number;
	requirements: string;
	startTimestamp: Date;
	successConditions: string;
	type: WorldEventType;
	expansion: Expansion;
}

export type WorldEvent = Partial<IWorldEvent>;

export class WorldEventModel {
	public static list(query?: IQueryDocument, projection?: Projection, cancelToken?: CancelToken) {
		return client.get('/events', {
			cancelToken,
			params: {
				p: projection,
				q: query,
			},
		}).then(response => {
			response.data = response.data.map(WorldEventModel.denormalize);

			return response;
		});
	}

	public static read(id: Id, projection?: Projection, cancelToken?: CancelToken) {
		return client.get<'/events/:id'>(`/events/${id}`, {
			cancelToken,
			params: {
				p: projection,
			},
		}).then(response => {
			response.data = WorldEventModel.denormalize(response.data);

			return response;
		});
	}

	private static denormalize(event: WorldEvent): WorldEvent {
		if (typeof event.startTimestamp === 'string')
			event.startTimestamp = parseIso8601Date(event.startTimestamp);

		if (typeof event.endTimestamp === 'string')
			event.endTimestamp = parseIso8601Date(event.endTimestamp);

		return event;
	}
}
