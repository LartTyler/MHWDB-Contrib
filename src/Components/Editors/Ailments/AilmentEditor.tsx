import {FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import {Cell, MultiSelect, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IConstraintViolations, isConstraintViolationError} from '../../../Api/Error';
import {AilmentModel, IAilmentPayload, RecoveryAction} from '../../../Api/Models/Ailment';
import {Item, ItemModel} from '../../../Api/Models/Item';
import {Skill, SkillModel} from '../../../Api/Models/Skill';
import {Projection} from '../../../Api/routes';
import {toaster} from '../../../toaster';
import {createEntityListFilter} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {Role} from '../../RequireRole';
import {EntitySelect} from '../../Select/EntitySelect';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {EditorButtons} from '../EditorButtons';

const itemsFilter = createEntityListFilter<Item>('name');
const skillsFilter = createEntityListFilter<Skill>('name');

interface IAilmentEditorRouteProps {
	ailment: string;
}

interface IAilmentEditorProps extends RouteComponentProps<IAilmentEditorRouteProps> {
}

interface IAilmentEditorState {
	description: string;
	items: Item[];
	loading: boolean;
	name: string;
	protectionItems: Item[];
	protectionSkills: Skill[];
	recoveryActions: RecoveryAction[];
	recoveryItems: Item[];
	redirect: boolean;
	saving: boolean;
	skills: Skill[];
	violations: IConstraintViolations;
}

const ItemEntitySelect = EntitySelect.ofType<Item>();
const SkillEntitySelect = EntitySelect.ofType<Skill>();

export class AilmentEditor extends React.PureComponent<IAilmentEditorProps, IAilmentEditorState> {
	public state: Readonly<IAilmentEditorState> = {
		description: '',
		items: null,
		loading: true,
		name: '',
		protectionItems: [],
		protectionSkills: [],
		recoveryActions: [],
		recoveryItems: [],
		redirect: false,
		saving: false,
		skills: null,
		violations: null,
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): JSX.Element {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/objects/ailments" />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.save}>
					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
								<InputGroup
									name="name"
									readOnly={readOnly}
									value={this.state.name}
									onChange={this.onNameInputChange}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={12}>
							<ValidationAwareFormGroup
								label="Description"
								labelFor="description"
								violations={this.state.violations}
							>
								<TextArea
									name="description"
									readOnly={readOnly}
									value={this.state.description}
									onChange={this.onDescriptionInputChange}
									fill={true}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<H2>Recovery</H2>

					<Row>
						<Cell size={6}>
							<FormGroup label="Items">
								<ItemEntitySelect
									config={{
										disabled: readOnly,
										itemListPredicate: itemsFilter,
										items: this.state.items || [],
										loading: this.state.items === null,
										multi: true,
										onClear: this.onRecoveryItemsClear,
										onItemDeselect: this.onRecoveryItemsDeselect,
										onItemSelect: this.onRecoveryItemsSelect,
										popoverProps: {
											targetClassName: 'full-width',
										},
										selected: this.state.recoveryItems,
									}}
									labelField="name"
								/>
							</FormGroup>
						</Cell>

						<Cell size={6}>
							<ValidationAwareFormGroup
								label="Actions"
								labelFor="actions"
								violations={this.state.violations}
							>
								<MultiSelect
									disabled={readOnly}
									items={Object.values(RecoveryAction)}
									itemTextRenderer={ucfirst}
									onClear={this.onRecoveryActionsClear}
									onItemDeselect={this.onRecoveryActionsDeselect}
									onItemSelect={this.onRecoveryActionsSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.recoveryActions}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<H2>Protection</H2>

					<Row>
						<Cell size={6}>
							<FormGroup label="Items">
								<ItemEntitySelect
									config={{
										disabled: readOnly,
										itemListPredicate: itemsFilter,
										items: this.state.items,
										loading: this.state.items === null,
										multi: true,
										onClear: this.onProtectionItemsClear,
										onItemDeselect: this.onProtectionItemsDeselect,
										onItemSelect: this.onProtectionItemsSelect,
										popoverProps: {
											targetClassName: 'full-width',
										},
										selected: this.state.protectionItems,
									}}
									labelField="name"
								/>
							</FormGroup>
						</Cell>

						<Cell size={6}>
							<FormGroup label="Skills">
								<SkillEntitySelect
									config={{
										disabled: readOnly,
										itemListPredicate: skillsFilter,
										items: this.state.skills,
										loading: this.state.skills === null,
										multi: true,
										onClear: this.onProtectionSkillsClear,
										onItemDeselect: this.onProtectionSkillsDeselect,
										onItemSelect: this.onProtectionSkillsSelect,
										popoverProps: {
											targetClassName: 'full-width',
										},
										selected: this.state.protectionSkills,
									}}
									labelField="name"
								/>
							</FormGroup>
						</Cell>
					</Row>

					<EditorButtons
						onClose={this.onClose}
						onSave={this.save}
						readOnly={readOnly}
						saving={this.state.saving}
					/>
				</form>
			</>
		);
	}

	private onClose = () => this.setState({
		redirect: true,
	});

	private onDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onProtectionItemsClear = () => this.setState({
		protectionItems: [],
	});

	private onProtectionItemsDeselect = (removed: Item) => this.setState({
		protectionItems: this.state.protectionItems.filter(item => item.id !== removed.id),
	});

	private onProtectionItemsSelect = (item: Item) => this.setState({
		protectionItems: [...this.state.protectionItems, item],
	});

	private onProtectionSkillsClear = () => this.setState({
		protectionSkills: [],
	});

	private onProtectionSkillsDeselect = (removed: Skill) => this.setState({
		protectionSkills: this.state.protectionSkills.filter(item => item.id !== removed.id),
	});

	private onProtectionSkillsSelect = (item: Skill) => this.setState({
		protectionSkills: [...this.state.protectionSkills, item],
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

	private onRecoveryItemsDeselect = (removed: Item) => this.setState({
		recoveryItems: this.state.recoveryItems.filter(item => item.id !== removed.id),
	});

	private onRecoveryItemsSelect = (item: Item) => this.setState({
		recoveryItems: [...this.state.recoveryItems, item],
	});

	private load(): void {
		const idParam = this.props.match.params.ailment;

		Promise.all([
			ItemModel.list(null, {
				id: true,
				name: true,
			}),
			SkillModel.list(null, {
				id: true,
				name: true,
			}),
			idParam !== 'new' && AilmentModel.read(idParam),
		]).then(responses => {
			this.setState({
				items: responses[0].data,
				loading: false,
				skills: responses[1].data,
			});

			if (!responses[2])
				return;

			const ailment = responses[2].data;

			const protectionItemIds = ailment.protection.items.map(item => item.id);
			const protectionSkillIds = ailment.protection.skills.map(skill => skill.id);
			const recoveryItemIds = ailment.recovery.items.map(item => item.id);

			this.setState({
				description: ailment.description,
				name: ailment.name,
				protectionItems: this.state.items.filter(item => protectionItemIds.indexOf(item.id) !== -1),
				protectionSkills: this.state.skills.filter(skill => protectionSkillIds.indexOf(skill.id) !== -1),
				recoveryActions: ailment.recovery.actions,
				recoveryItems: this.state.items.filter(item => recoveryItemIds.indexOf(item.id) !== -1),
			});
		});
	}

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const payload: IAilmentPayload = {
			description: this.state.description.trim() || null,
			name: this.state.name,
			protection: {
				items: this.state.protectionItems.map(item => item.id),
				skills: this.state.protectionSkills.map(skill => skill.id),
			},
			recovery: {
				actions: this.state.recoveryActions,
				items: this.state.recoveryItems.map(item => item.id),
			},
		};

		const projection: Projection = {
			name: true,
		};

		const ailmentId = this.props.match.params.ailment;
		let promise: Promise<unknown>;

		if (ailmentId === 'new')
			promise = AilmentModel.create(payload, projection);
		else
			promise = AilmentModel.update(parseInt(ailmentId, 10), payload, projection);

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} ${ailmentId === 'new' ? 'created' : 'saved'} successfully.`,
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			this.setState({
				saving: false,
			});

			if (isConstraintViolationError(error)) {
				this.setState({
					violations: error.context.violations,
				});
			}
		});
	};
}
