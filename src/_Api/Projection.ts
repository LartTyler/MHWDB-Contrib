interface IProjection<T extends boolean> {
	[key: string]: T;
}

export type Projection = IProjection<true> | IProjection<false>;
