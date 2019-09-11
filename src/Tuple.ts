export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {length: TLength};
