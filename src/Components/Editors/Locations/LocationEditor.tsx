import {Button, H2, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {IConstraintViolations, isConstraintViolationError} from '../../../Api/Error';
import {Camp, LocationModel, LocationPayload} from '../../../Api/Models/Location';
import {toaster} from '../../../toaster';
import {cleanNumberString} from '../../../Utility/number';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {createEntitySorter} from '../EntityList';
import {Camps} from './Camps';

const campSorter = createEntitySorter<Camp>('zone');

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
	showAddCampDialog: boolean;
	violations: IConstraintViolations;
	zoneCount: string;
}

class LocationEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		camps: [],
		loading: true,
		name: '',
		redirect: false,
		saving: false,
		showAddCampDialog: false,
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
			camps: response.data.camps.sort(campSorter),
			loading: false,
			name: response.data.name,
			zoneCount: response.data.zoneCount.toString(10),
		}));
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/locations" />;

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.onSave}>
					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup
								label="Name"
								labelFor="name"
								violations={this.state.violations}
							>
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

					<H2>Camps</H2>

					<Camps
						camps={this.state.camps}
						onDelete={this.onCampDelete}
						onSave={this.onCampAdd}
						zoneCount={parseInt(this.state.zoneCount, 10)}
					/>

					<Row align="end">
						<Cell size={1}>
							<Button disabled={this.state.saving} fill={true} onClick={this.onCancelClick}>
								Cancel
							</Button>
						</Cell>

						<Cell size={1}>
							<Button
								fill={true}
								intent={Intent.PRIMARY}
								loading={this.state.saving}
								onClick={this.onSave}
							>
								Save
							</Button>
						</Cell>
					</Row>
				</form>
			</>
		);
	}

	private onCampAdd = (camp: Camp) => this.setState({
		camps: [
			...this.state.camps,
			camp,
		].sort(campSorter),
	});

	private onCampDelete = (target: Camp) => {
		this.setState({
			camps: this.state.camps.filter(camp => camp !== target),
		});
	};

	private onCancelClick = () => this.setState({
		redirect: true,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onZoneCountChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		zoneCount: cleanNumberString(event.currentTarget.value, false),
	});

	private onSave = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		this.setState({
			saving: true,
		});

		const payload: LocationPayload = {
			camps: this.state.camps,
			name: this.state.name,
			zoneCount: parseInt(this.state.zoneCount, 10),
		};

		const idParam = this.props.match.params.location;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = LocationModel.create(payload);
		else
			promise = LocationModel.update(idParam, payload);

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} ${idParam === 'new' ? 'created' : 'saved'} successfully.`,
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			if (isConstraintViolationError(error)) {
				this.setState({
					violations: error.context.violations,
				});
			}
		});
	};
}

export const LocationEditor = withRouter(LocationEditorComponent);
