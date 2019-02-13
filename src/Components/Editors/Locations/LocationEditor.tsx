import {H2, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {IConstraintViolations} from '../../../Api/Error';
import {Camp, LocationModel} from '../../../Api/Models/Location';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';

interface IRouteProps {
	location: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	camps: Camp[];
	loading: boolean;
	name: string;
	redirect: boolean;
	saving: boolean;
	violations: IConstraintViolations;
	zoneCount: string;
}

class LocationEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		camps: [],
		loading: true,
		name: '',
		redirect: false,
		saving: false,
		violations: {},
		zoneCount: '',
	};

	public componentDidMount(): void {
		const idParam = this.props.match.params.location;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		LocationModel.read(idParam).then(response => this.setState({
			camps: response.data.camps,
			loading: false,
			name: response.data.name,
			zoneCount: response.data.zoneCount.toString(10),
		}));
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_LARGE} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/locations" />;

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.onSave}>
					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
								<InputGroup name="name" onChange={this.onNameChange} value={this.state.name} />
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={6}>
							<ValidationAwareFormGroup
								label="Zone Count"
								labelFor="zoneCount"
								violations={this.state.violations}
							>
								<InputGroup
									name="zoneCount"
									onChange={this.onZoneCountChange}
									value={this.state.zoneCount}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>
				</form>
			</>
		);
	}

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onZoneCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		let zoneCount = value.replace(/[^\d]/g, '');

		if (value.charAt(0) === '-')
			zoneCount = `-${zoneCount}`;

		this.setState({
			zoneCount,
		});
	};

	private onSave = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		this.setState({
			saving: true,
		});
	};
}
