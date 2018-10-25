import {Button} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {IAilment} from '../../../Api/Objects/Ailment';
import {compareFields} from '../../../Api/Objects/Entity';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {Cell, Row} from '../../Grid';
import {Manager} from '../../Manager/Manager';
import {ManagerHeader} from '../../Manager/ManagerHeader';
import {RefreshButton} from '../../Manager/RefreshButton';
import {RowControls} from '../../Manager/RowControls';
import {SearchInput} from '../../Search';
import {Table} from '../../Table';

interface IAilmentListProps extends IApiClientAware, IToasterAware {
}

type Ailment = Pick<IAilment, 'id' | 'name' | 'description'>;

interface IAilmentListState {
	ailments: Ailment[];
	loading: boolean;
	search: string;
}

class AilmentListComponent extends React.PureComponent<IAilmentListProps, IAilmentListState> {
	public state: Readonly<IAilmentListState> = {
		ailments: [],
		loading: false,
		search: '',
	};

	public componentDidMount(): void {
		this.loadAilments();
	}

	public render(): JSX.Element {
		return (
			<Manager>
				<ManagerHeader
					title="Ailments"
					refresh={<RefreshButton onRefresh={this.loadAilments} />}
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
					dataSource={this.state.ailments}
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

	private onSearchInputChange = (search: string) => this.setState({
		search,
	});

	private onDeleteButtonClick = (target: Ailment) => {
		return this.props.client.ailments.delete(target).then(() => this.setState({
			ailments: this.state.ailments.filter(ailment => ailment.id !== target.id),
		}));
	};

	private loadAilments = () => {
		this.setState({
			loading: true,
		});

		this.props.client.ailments.list(null, {
			description: true,
			id: true,
			name: true,
		}).then(ailments => this.setState({
			ailments: ailments.sort((a, b) => compareFields('name', a, b)),
			loading: false,
		}));
	};
}

export const AilmentList = withApiClient(withToasterContext(AilmentListComponent));
