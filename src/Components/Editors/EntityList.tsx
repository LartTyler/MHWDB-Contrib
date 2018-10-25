import {Button} from '@blueprintjs/core';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {sort} from 'semver';
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

interface IEntityListProps<T extends IEntity> extends RouteComponentProps<{}> {
	projection: Projection;
	provider: IApiClientModule<T>;
	sorter: (a: T, b: T) => -1 | 0 | 1;
	tableColumns: IColumn<T>[];
	tableNoDataPlaceholder: React.ReactNode;
	title: string;
}

interface IEntityListState<T extends IEntity> {
	columns: IColumn<T>[];
	controller: AbortController;
	entities: T[];
	loading: boolean;
	search: string;
}

export class EntityListComponent<T extends IEntity>
	extends React.PureComponent<IEntityListProps<T>, IEntityListState<T>> {
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
							editPath={`${props.location.pathname}/${record.id}`}
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
						<Link to="/edit/ailments/new" className="plain-link">
							<Button icon="plus">
								Add New
							</Button>
						</Link>
					</Cell>
				</Row>

				<Table
					dataSource={this.state.entities}
					columns={[
						{
							dataIndex: 'name',
							onFilter: (record, search) => record.name.toLowerCase().indexOf(search) > -1,
							style: {
								minWidth: 250,
							},
							title: 'Name',
						},
						{
							dataIndex: 'description',
							onFilter: (record, search) => record.description.toLowerCase().indexOf(search) > -1,
							title: 'Description',
						},
						{
							align: 'right',
							render: record => (
								<RowControls
									entity={record}
									editPath={`/edit/ailments/${record.id}`}
									onDelete={this.onDeleteButtonClick}
								/>
							),
							style: {
								width: 200,
							},
							title: 'Controls',
						},
					]}
					fullWidth={true}
					htmlTableProps={{
						interactive: true,
						striped: true,
					}}
					loading={this.state.loading}
					noDataPlaceholder={<span>No ailments found.</span>}
					rowKey="id"
					searchText={this.state.search}
				/>
			</Manager>
		);
	}

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
