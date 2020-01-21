import {H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IValidationFailures, isValidationFailedError} from '../../../Api/Error';
import {MotionValueModel} from '../../../Api/Models/MotionValue';
import {DamageType, WeaponType, weaponTypeLabels} from '../../../Api/Models/Weapon';
import {toaster} from '../../../toaster';
import {cleanNumberString} from '../../../Utility/number';
import {Role} from '../../RequireRole';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {EditorButtons} from '../EditorButtons';

interface IDamageTypeItem {
	label: string;
	type: DamageType;
}

export const damageTypes: IDamageTypeItem[] = [
	{
		label: 'Blunt',
		type: DamageType.BLUNT,
	},
	{
		label: 'Projectile',
		type: DamageType.PROJECTILE,
	},
	{
		label: 'Sever',
		type: DamageType.SEVER,
	},
];

interface IRouteProps {
	motionValue: string;
	weaponType: WeaponType;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	damageType: IDamageTypeItem;
	exhaust: string;
	hits: string;
	loading: boolean;
	name: string;
	redirect: boolean;
	saving: boolean;
	stun: string;
	violations: IValidationFailures;
}

class MotionValueEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		damageType: null,
		exhaust: '',
		hits: '',
		loading: true,
		name: '',
		redirect: false,
		saving: false,
		stun: '',
		violations: {},
	};

	public componentDidMount(): void {
		const idParam = this.props.match.params.motionValue;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		MotionValueModel.read(idParam).then(response => this.setState({
			damageType: damageTypes.find(item => item.type === response.data.damageType),
			exhaust: response.data.exhaust ? response.data.exhaust.toString(10) : '',
			hits: response.data.hits.join(', '),
			loading: false,
			name: response.data.name,
			stun: response.data.stun ? response.data.stun.toString(10) : '',
		}));
	}

	public render(): React.ReactNode {
		const type = this.props.match.params.weaponType;

		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to={`/objects/motion-values/${type}`} />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<form onSubmit={this.save}>
				<H2>{weaponTypeLabels[type]}: {this.state.name || 'No Name'}</H2>

				<Row>
					<Cell size={6}>
						<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
							<InputGroup
								name="name"
								onChange={this.onNameChange}
								readOnly={readOnly}
								value={this.state.name}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={6}>
						<ValidationAwareFormGroup
							label="Damage Type"
							labelFor="damageType"
							violations={this.state.violations}
						>
							<Select
								disabled={readOnly}
								items={damageTypes}
								filterable={false}
								itemTextRenderer={this.renderDamageType}
								onItemSelect={this.onDamageTypeSelect}
								popoverProps={{
									targetClassName: 'full-width',
								}}
								selected={this.state.damageType}
							/>
						</ValidationAwareFormGroup>
					</Cell>
				</Row>

				<Row>
					<Cell size={6}>
						<ValidationAwareFormGroup label="Exhaust" labelFor="exhaust" violations={this.state.violations}>
							<InputGroup
								name="exhaust"
								onChange={this.onExhaustChange}
								placeholder="0"
								readOnly={readOnly}
								value={this.state.exhaust}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={6}>
						<ValidationAwareFormGroup label="Stun" labelFor="stun" violations={this.state.violations}>
							<InputGroup
								name="stun"
								onChange={this.onStunChange}
								placeholder="0"
								readOnly={readOnly}
								value={this.state.stun}
							/>
						</ValidationAwareFormGroup>
					</Cell>
				</Row>

				<ValidationAwareFormGroup
					helperText={!readOnly && 'Enter each hit of the motion value, separated by either a new line or a comma.'}
					label="Hits"
					labelFor="hits"
					violations={this.state.violations}
				>
					<TextArea
						name="hits"
						onChange={this.onHitsChange}
						readOnly={readOnly}
						style={{minWidth: '100%'}}
						value={this.state.hits}
					/>
				</ValidationAwareFormGroup>

				<EditorButtons
					onClose={this.onClose}
					onSave={this.save}
					readOnly={readOnly}
					saving={this.state.saving}
				/>
			</form>
		);
	}

	private renderDamageType = (item: IDamageTypeItem) => item.label;

	private onClose = () => this.setState({
		redirect: true,
	});

	private onDamageTypeSelect = (item: IDamageTypeItem) => this.setState({
		damageType: item,
	});

	private onExhaustChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		exhaust: cleanNumberString(event.currentTarget.value, false),
	});

	private onHitsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		hits: event.currentTarget.value,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onStunChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		stun: cleanNumberString(event.currentTarget.value, false),
	});

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const split = this.state.hits.split(/[,\n]/g);
		const hits = [];

		for (let item of split) {
			item = item.trim();

			if (!item)
				continue;

			const cleaned = cleanNumberString(item, false);
			const value = parseInt(cleaned, 10);

			if (isNaN(value)) {
				this.setState({
					saving: false,
					violations: {
						hits: {
							code: '',
							message: 'One or more hits were not properly formatted',
							path: 'hits',
						},
					},
				});

				return;
			}

			hits.push(value);
		}

		const payload = {
			damageTypes: this.state.damageType.type,
			exhaust: parseInt(this.state.exhaust, 10) || null,
			hits,
			name: this.state.name,
			stun: parseInt(this.state.stun, 10) || null,
			weaponType: this.props.match.params.weaponType,
		};

		const idParam = this.props.match.params.motionValue;
		let promise: Promise<unknown> = null;

		if (idParam === 'new')
			promise = MotionValueModel.create(payload, {id: true});
		else
			promise = MotionValueModel.update(idParam, payload, {id: true});

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} ${idParam === 'new' ? 'created' : 'updated'}.`,
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			if (isValidationFailedError(error)) {
				this.setState({
					violations: error.context.failures,
				});
			}

			this.setState({
				saving: false,
			});
		});
	};
}

export const MotionValueEditor = withRouter(MotionValueEditorComponent);
