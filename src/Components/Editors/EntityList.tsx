import {Button} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {IApiClientModule} from '../../Api/Module';
import {IEntity} from '../../Api/Objects/Entity';
import {Projection} from '../../Api/Projection';
import {Cell, Row} from '../Grid';
import {Manager} from '../Manager/Manager';
import {ManagerHeader} from '../Manager/ManagerHeader';
import {RefreshButton} from '../Manager/RefreshButton';
import {RowControls} from '../Manager/RowControls';
import {SearchInput} from '../Search';
import {IColumn, Table} from '../Table';

interface IEntityListProps<T extends IEntity> {
	basePath: string;
	projection: Projection;
	provider: IApiClientModule<T>;
	sorter: (a: T, b: T) => -1 | 0 | 1;
	tableColumns: Array<IColumn<T>>;
	tableNoDataPlaceholder: React.ReactNode;
	title: string;
}

interface IEntityListState<T extends IEntity> {
	columns: Array<IColumn<T>>;
	controller: AbortController;
	entities: T[];
	loading: boolean;
	search: string;
}

export class EntityList<T extends IEntity> extends React.PureComponent<IEntityListProps<T>, IEntityListState<T>> {
	public constructor(props: IEntityListProps<T>) {
		super(props);

		this.state = {
			columns: [
				...props.tableColumns,
				{
					align: 'right',
					render: record => (
						<RowControls
							entity={record}
							editPath={`${props.basePath}/${record.id}`}
							onDelete={this.onDeleteButtonClick}
						/>
					),
					style: {
						width: 200,
					},
					title: 'Controls',
				},
			],
			controller: null,
			entities: [],
			loading: false,
			search: '',
		};
	}

	public componentDidMount(): void {
		this.loadEntities();
	}

	public componentWillUnmount(): void {
		if (this.state.controller)
			this.state.controller.abort();
	}

	public render(): React.ReactNode {
		return (
			<Manager>
				<ManagerHeader
					title="Ailments"
					refresh={<RefreshButton onRefresh={this.loadEntities} />}
					search={<SearchInput onSearch={this.onSearchInputChange} />}
				/>

				<Row align="end">
					<Cell size={2}>
						<Link to={`${this.props.basePath}/new`} className="plain-link">
							<Button icon="plus">
								Add New
							</Button>
						</Link>
					</Cell>
				</Row>

				<Table
					dataSource={this.state.entities}
					columns={this.state.columns}
					fullWidth={true}
					htmlTableProps={{
						interactive: true,
						striped: true,
					}}
					loading={this.state.loading}
					noDataPlaceholder={this.props.tableNoDataPlaceholder}
					rowKey="id"
					searchText={this.state.search}
				/>
			</Manager>
		);
	}

	private onDeleteButtonClick = (target: T) => {
		return this.props.provider.delete(target).then(() => this.setState({
			entities: this.state.entities.filter(entity => entity.id !== target.id),
		}));
	};

	private onSearchInputChange = (search: string) => this.setState({
		search,
	});

	private loadEntities = () => {
		if (this.state.controller)
			this.state.controller.abort();

		const controller = new AbortController();

		this.setState({
			controller,
			loading: true,
		});

		this.props.provider.list(null, this.props.projection, controller.signal).then(entities => this.setState({
			controller: null,
			entities: entities.sort(this.props.sorter),
			loading: false,
		}));
	};
}
