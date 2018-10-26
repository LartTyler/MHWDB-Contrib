import {Button, FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {IAilment, RecoveryAction} from '../../../Api/Objects/Ailment';
import {IItem} from '../../../Api/Objects/Item';
import {ISkill} from '../../../Api/Objects/Skill';
import {Projection} from '../../../Api/Projection';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {Cell, Row} from '../../Grid';
import {LinkButton} from '../../Navigation/LinkButton';
import {EntitySelect} from '../../Select/EntitySelect';
import {StringSelect} from '../../Select/StringSelect';

interface IAilmentEditorRouteProps {
	ailment: string;
}

interface IAilmentEditorProps extends IApiClientAware, IToasterAware, RouteComponentProps<IAilmentEditorRouteProps> {
}

interface IAilmentEditorState {
	description: string;
	loading: boolean;
	name: string;
	protectionItems: IItem[];
	protectionSkills: ISkill[];
	recoveryActions: RecoveryAction[];
	recoveryItems: IItem[];
	redirect: boolean;
	saving: boolean;
}

class AilmentEditorComponent extends React.PureComponent<IAilmentEditorProps, IAilmentEditorState> {
	public state: Readonly<IAilmentEditorState> = {
		description: '',
		loading: true,
		name: '',
		protectionItems: [],
		protectionSkills: [],
		recoveryActions: [],
		recoveryItems: [],
		redirect: false,
		saving: false,
	};

	public componentDidMount(): void {
		this.loadAilment();
	}

	public render(): JSX.Element {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/ailments" />;

		return (
			<>
				<H2>{this.state.name.length ? this.state.name : 'Unnamed'}</H2>

				<form onSubmit={this.save}>
					<Row>
						<Cell size={6}>
							<FormGroup label="Name" labelFor="name">
								<InputGroup name="name" value={this.state.name} onChange={this.onNameInputChange} />
							</FormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={12}>
							<FormGroup label="Description" labelFor="description">
								<TextArea
									name="description"
									value={this.state.description}
									onChange={this.onDescriptionInputChange}
									fill={true}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H2>Recovery</H2>

					<Row>
						<Cell size={6}>
							<FormGroup label="Items">
								<EntitySelect
									labelField="name"
									multiSelect={true}
									onClear={this.onRecoveryItemsClear}
									onItemDeselect={this.onRecoveryItemsDeselect}
									onItemSelect={this.onRecoveryItemsSelect}
									onSelectionLoad={this.onRecoveryItemsLoad}
									provider={this.props.client.items}
									selected={this.state.recoveryItems}
								/>
							</FormGroup>
						</Cell>

						<Cell size={6}>
							<FormGroup label="Actions">
								<StringSelect
									dataSource={[RecoveryAction.DODGE]}
									multiSelect={true}
									onClear={this.onRecoveryActionsClear}
									onItemDeselect={this.onRecoveryActionsDeselect}
									onItemSelect={this.onRecoveryActionsSelect}
									selected={this.state.recoveryActions}
									valueRenderer={this.renderRecoveryActionValue}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H2>Protection</H2>

					<Row>
						<Cell size={6}>
							<FormGroup label="Items">
								<EntitySelect
									labelField="name"
									multiSelect={true}
									onClear={this.onProtectionItemsClear}
									onItemDeselect={this.onProtectionItemsDeselect}
									onItemSelect={this.onProtectionItemsSelect}
									onSelectionLoad={this.onProtectionItemsLoad}
									provider={this.props.client.items}
									selected={this.state.protectionItems}
								/>
							</FormGroup>
						</Cell>

						<Cell size={6}>
							<FormGroup label="Skills">
								<EntitySelect
									labelField="name"
									multiSelect={true}
									onClear={this.onProtectionSkillsClear}
									onItemDeselect={this.onProtectionSkillsDeselect}
									onItemSelect={this.onProtectionSkillsSelect}
									onSelectionLoad={this.onProtectionSkillsLoad}
									provider={this.props.client.skills}
									selected={this.state.protectionSkills}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<Row align="end">
						<Cell size={1}>
							<LinkButton to="/edit/ailments" buttonProps={{fill: true, loading: this.state.saving}}>
								Cancel
							</LinkButton>
						</Cell>

						<Cell size={1}>
							<Button intent={Intent.PRIMARY} fill={true} loading={this.state.saving} onClick={this.save}>
								Save
							</Button>
						</Cell>
					</Row>
				</form>
			</>
		);
	}

	private renderRecoveryActionValue = (action: string) => `${action.charAt(0).toUpperCase()}${action.substr(1)}`;

	private onDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onProtectionItemsClear = () => this.setState({
		protectionItems: [],
	});

	private onProtectionItemsDeselect = (removed: IItem) => this.setState({
		protectionItems: this.state.protectionItems.filter(item => item.id !== removed.id),
	});

	private onProtectionItemsSelect = (item: IItem) => this.setState({
		protectionItems: [...this.state.protectionItems, item],
	});

	private onProtectionItemsLoad = (selected: IItem[]) => this.setState({
		protectionItems: selected,
	});

	private onProtectionSkillsClear = () => this.setState({
		protectionSkills: [],
	});

	private onProtectionSkillsDeselect = (removed: ISkill) => this.setState({
		protectionSkills: this.state.protectionSkills.filter(item => item.id !== removed.id),
	});

	private onProtectionSkillsSelect = (item: ISkill) => this.setState({
		protectionSkills: [...this.state.protectionSkills, item],
	});

	private onProtectionSkillsLoad = (selected: ISkill[]) => this.setState({
		protectionSkills: selected,
	});

	private onRecoveryActionsClear = () => this.setState({
		recoveryActions: [],
	});

	private onRecoveryActionsDeselect = (removed: RecoveryAction) => this.setState({
		recoveryActions: this.state.recoveryActions.filter(item => item !== removed),
	});

	private onRecoveryActionsSelect = (item: RecoveryAction) => this.setState({
		recoveryActions: [...this.state.recoveryActions, item],
	});

	private onRecoveryItemsClear = () => this.setState({
		recoveryItems: [],
	});

	private onRecoveryItemsDeselect = (removed: IItem) => this.setState({
		recoveryItems: this.state.recoveryItems.filter(item => item.id !== removed.id),
	});

	private onRecoveryItemsSelect = (item: IItem) => this.setState({
		recoveryItems: [...this.state.recoveryItems, item],
	});

	private onRecoveryItemsLoad = (selected: IItem[]) => this.setState({
		recoveryItems: selected,
	});

	private loadAilment(): void {
		const idParam = this.props.match.params.ailment;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		this.props.client.ailments.get(parseInt(idParam, 10), {
			description: true,
			name: true,
			'protection.items.id': true,
			'protection.items.name': true,
			'protection.skills.id': true,
			'protection.skills.name': true,
			'recovery.actions': true,
			'recovery.items.id': true,
			'recovery.items.name': true,
		}).then(ailment => this.setState({
			description: ailment.description,
			loading: false,
			name: ailment.name,
			protectionItems: ailment.protection.items,
			protectionSkills: ailment.protection.skills,
			recoveryActions: ailment.recovery.actions,
			recoveryItems: ailment.recovery.items,
		}));
	}

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const payload: IAilment = {
			description: this.state.description,
			name: this.state.name,
			protection: {
				items: this.state.protectionItems,
				skills: this.state.protectionSkills,
			},
			recovery: {
				actions: this.state.recoveryActions,
				items: this.state.recoveryItems,
			},
		};

		const projection: Projection = {
			name: true,
		};

		const ailmentId = this.props.match.params.ailment;
		let promise: Promise<IAilment>;

		if (ailmentId === 'new')
			promise = this.props.client.ailments.create(payload, projection);
		else
			promise = this.props.client.ailments.update(parseInt(ailmentId, 10), payload, projection);

		promise.then(ailment => {
			this.props.toaster.show({
				intent: Intent.SUCCESS,
				message: `${ailment.name} ${ailmentId === 'new' ? 'created' : 'saved'} successfully.`,
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			this.props.toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			this.setState({
				saving: false,
			});
		});
	};
}

export const AilmentEditor = withApiClient(withToasterContext(AilmentEditorComponent));
