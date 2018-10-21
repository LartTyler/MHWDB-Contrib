import * as React from 'react';
import {IAilment} from '../../../Api/Objects/Ailment';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
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

				<Table
					dataSource={this.state.ailments}
					columns={[
						{
							dataIndex: 'name',
							onFilter: (record, search) => record.name.toLowerCase().indexOf(search) > -1,
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
					searchText={this.state.search}
					htmlTableProps={{
						interactive: true,
						striped: true,
					}}
					fullWidth={true}
					loading={this.state.loading}
					noDataPlaceholder={<span>No ailments found.</span>}
				/>
			</Manager>
		);
	}

	private onSearchInputChange = (search: string) => this.setState({
		search,
	});

	private onDeleteButtonClick = (entity: Ailment) => {
		return this.props.client.ailments.delete(entity);
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
			ailments: ailments.sort((a, b) => {
				const aVal = a.name.toLowerCase();
				const bVal = b.name.toLowerCase();

				if (aVal > bVal)
					return 1;
				else if (aVal < bVal)
					return -1;

				return 0;
			}),
			loading: false,
		}));
	};
}

export const AilmentList = withApiClient(withToasterContext(AilmentListComponent));
