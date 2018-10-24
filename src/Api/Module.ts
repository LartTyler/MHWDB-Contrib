import {ApiClient} from './ApiClient';
import {Identifiable, IEntity, toIdentifier} from './Objects/Entity';
import {Projection} from './Projection';
import {IQueryDocument} from './Query';

export interface IApiClientModule<T extends IEntity> {
	list(query?: IQueryDocument, projection?: Projection, signal?: AbortSignal): Promise<T[]>;

	get(target: Identifiable<T>, projection?: Projection, signal?: AbortSignal): Promise<T>;

	update(target: Identifiable<T>, values: T, projection?: Projection): Promise<T>;

	delete(target: Identifiable<T>): Promise<void>;
}

export abstract class AbstractApiClientModule<T extends IEntity> implements IApiClientModule<T> {
	protected client: ApiClient;
	protected basePath: string;

	protected constructor(client: ApiClient, basePath: string) {
		this.client = client;
		this.basePath = basePath;
	}

	public delete(target: Identifiable<T>): Promise<void> {
		return this.client.delete(`${this.basePath}/${toIdentifier(target)}`);
	}

	public get(target: Identifiable<T>, projection?: Projection, signal?: AbortSignal): Promise<T> {
		return this.client
			.read(`${this.basePath}/${toIdentifier(target)}`, projection, signal)
			.then((entity: T) => {
				if (entity !== null)
					entity = this.denormalize(entity);

				return entity;
			});
	}

	public list(query?: IQueryDocument, projection?: Projection, signal?: AbortSignal): Promise<T[]> {
		return this.client
			.list(this.basePath, query, projection, signal)
			.then(entities => entities.map(this.denormalize));
	}

	public update(target: Identifiable<T>, values: T, projection?: Projection): Promise<T> {
		return this.client
			.update(`${this.basePath}/${toIdentifier(target)}`, this.normalize(values), projection)
			.then(this.denormalize);
	}

	protected normalize(entity: T): object {
		return entity;
	}

	protected denormalize(entity: T): T {
		return entity;
	}
}
