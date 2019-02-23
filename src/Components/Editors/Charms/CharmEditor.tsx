import {H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {IConstraintViolations} from '../../../Api/Error';
import {CharmModel, CharmRank} from '../../../Api/Models/Charm';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';

interface IRouteProps {
	charm: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	loading: boolean;
	name: string;
	ranks: CharmRank[];
	redirect: boolean;
	saving: boolean;
	violations: IConstraintViolations;
}

class CharmEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		loading: true,
		name: '',
		ranks: [],
		redirect: false,
		saving: false,
		violations: {},
	};

	public componentDidMount(): void {
		const idParam = this.props.match.params.charm;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		CharmModel.read(idParam).then(response => this.setState({
			loading: false,
			name: response.data.name,
			ranks: response.data.ranks,
		}));
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.save}>
					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
								<InputGroup name="name" onChange={this.onNameChange} value={this.state.name} />
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<H3>Ranks</H3>
				</form>
			</>
		);
	}

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
		ranks: this.state.ranks.map(rank => {
			rank.name = `${event.currentTarget.value} ${rank.level}`;

			return rank;
		}),
	});

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});
	};
}

export const CharmEditor = withRouter(CharmEditorComponent);
