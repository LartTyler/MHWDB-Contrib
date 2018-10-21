import {HTMLTable, IHTMLTableProps, Intent, Spinner} from '@blueprintjs/core';
import * as React from 'react';

interface IColumn<T> {
	/**
	 * The column's header node.
	 */
	title: React.ReactNode;

	/**
	 * The name of the key to render in the cells of the column. It must be a key available on each object in the
	 * table's `dataSource` prop.
	 */
	dataIndex?: keyof T;

	/**
	 * A callback to invoke when rendering a cell in the column. It should accept an item from the table's `dataSource`
	 * prop, and return a node to render in the cell.
	 *
	 * If provided, this prop takes priority over `dataIndex`.
	 */
	render?: (record: T, index: number) => React.ReactNode;

	/**
	 * The text alignment to apply to the column. Defaults to the parent container's alignment.
	 */
	align?: 'left' | 'right' | 'center';

	/**
	 * The name of the key on objects in the table's `dataSource` to use for the cell's `key` prop. If not provided, the
	 * column index will be used instead.
	 */
	key?: keyof T;

	/**
	 * A callback to invoke when filtering items in the table. If not provided, the cells in the column will not be
	 * considered when attempting to filter the table's rows.
	 *
	 * If ANY column filters return `true`, the entire row will be rendered.
	 */
	onFilter?: (record: T, search: string) => boolean;

	/**
	 * A list of CSS styles to apply to the column.
	 */
	style?: React.CSSProperties;
}

interface ITableProps<T> {
	/**
	 * An array containing the data that backs the table.
	 */
	dataSource: T[];

	/**
	 * An array of {@see IColumn<T>} objects describing how to render the columns of the table.
	 */
	columns: Array<IColumn<T>>;

	/**
	 * Describes how to find a value to use as the `key` prop on each table row. It can be either the name of a key
	 * on all the objects in `dataSource`, or a function that takes in the row's record and returns the key value.
	 *
	 * If not provided, the index of the item in `dataSource` will be used as the row key.
	 */
	rowKey?: keyof T | ((record: T, index: number) => string);

	/**
	 * If provided and set to `true`, a loading spinner will be rendered instead of the table.
	 *
	 * You can override the component used for the spinner by passing a component in the `loadingSpinner` prop.
	 */
	loading?: boolean;

	/**
	 * The component to render if the `loading` prop is `true`. If not provided, a default spinner will be used instead.
	 */
	loadingSpinner?: React.ReactNode;

	/**
	 * A component to render in place of the table if `dataSource` is empty.
	 */
	noDataPlaceholder?: React.ReactNode;

	/**
	 * A dictionary of CSS styles to apply to the wrapped {@see HTMLTable} component.
	 */
	styles?: React.CSSProperties;

	/**
	 * If a non-empty value is provided for this prop, the table will only render items from `dataSource` whose
	 * corresponding `onFilter` prop returns true.
	 */
	searchText?: string;

	/**
	 * If `true`, the table will expand horizontally to fill it's container.
	 */
	fullWidth?: boolean;

	/**
	 * A dictionary of properties to apply to the wrapped {@see HTMLTable} component.
	 */
	htmlTableProps?: IHTMLTableProps;
}

interface ITableState<T> {
	filteredColumns: Array<IColumn<T>>;
}

export class Table<T> extends React.Component<ITableProps<T>, ITableState<T>> {
	public static defaultProps: Partial<ITableProps<any>> = {
		dataSource: [],
		fullWidth: false,
		htmlTableProps: {},
		loading: false,
		styles: {},
	};

	public constructor(props: ITableProps<T>) {
		super(props);

		this.state = {
			filteredColumns: this.collectFilters(),
		};
	}

	public render(): JSX.Element {
		if (this.props.loading) {
			return (
				<>
					{this.props.loadingSpinner || (
						<div style={{maxWidth: 100}}>
							<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
						</div>
					)}
				</>
			);
		}

		const rows = this.getRows();

		if (rows.length === 0 && this.props.noDataPlaceholder) {
			return (
				<>
					{this.props.noDataPlaceholder}
				</>
			);
		}

		const styles = {...this.props.styles};

		if (this.props.fullWidth) {
			styles.width = '100%';
		}

		return (
			<HTMLTable style={styles} {...this.props.htmlTableProps}>
				<thead>
					<tr>
						{this.getHeaders()}
					</tr>
				</thead>

				<tbody>
					{rows}
				</tbody>
			</HTMLTable>
		);
	}

	private collectFilters(): Array<IColumn<T>> {
		return this.props.columns.filter(column => column.onFilter);
	}

	private getHeaders(): React.ReactNode[] {
		return this.props.columns.map((column, index) => {
			const classes: string[] = [];

			if (column.align)
				classes.push(`text-${column.align}`);

			return (
				<th key={index} className={classes.join(' ')} style={column.style}>
					{column.title}
				</th>
			);
		});
	}

	private getRows(): React.ReactNode[] {
		const {dataSource} = this.props;

		const rows: React.ReactNode[] = [];

		for (let index = 0; index < dataSource.length; index++) {
			const datum = dataSource[index];
			const cells = this.getCells(datum);

			if (cells === null)
				continue;

			const rowKeyProp = this.props.rowKey;
			let rowKey: string;

			if (typeof rowKeyProp === 'string')
				rowKey = datum[rowKeyProp].toString();
			else if (typeof rowKeyProp === 'function')
				rowKey = rowKeyProp(datum, index);
			else
				rowKey = index.toString(10);

			rows.push((
				<tr key={rowKey}>
					{cells}
				</tr>
			));
		}

		return rows;
	}

	private getCells(row: T): React.ReactNode {
		if (!this.filterRow(row))
			return null;

		const {columns} = this.props;

		const cells: React.ReactNode[] = [];

		for (let index = 0; index < columns.length; index++) {
			const column = columns[index];

			let cell: React.ReactNode;

			if (column.render)
				cell = column.render(row, index);
			else if (column.dataIndex)
				cell = row[column.dataIndex];
			else
				throw new Error('You must specify either `render` or `dataIndex` for each table column');

			const key = (
				column.key ? row[column.key] : index
			) as React.Key;
			const classes: string[] = [];

			if (column.align)
				classes.push(`text-${column.align}`);

			const styles = column.style || {};
			styles.verticalAlign = 'middle';

			cells.push((
				<td key={key} className={classes.join(' ')} style={styles}>
					{cell}
				</td>
			));
		}

		return cells;
	}

	private filterRow(row: T): boolean {
		if (this.state.filteredColumns.length === 0)
			return true;

		for (const column of this.state.filteredColumns) {
			if (column.onFilter(row, this.props.searchText))
				return true;
		}

		return false;
	}
}
