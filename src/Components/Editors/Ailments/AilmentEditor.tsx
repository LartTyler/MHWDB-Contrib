import {Button, FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import {Cell, MultiSelect, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
import {AilmentModel, IAilmentPayload, RecoveryAction} from '../../../Api/Models/Ailment';
import {Item, ItemModel} from '../../../Api/Models/Item';
import {Skill, SkillModel} from '../../../Api/Models/Skill';
import {Projection} from '../../../Api/routes';
import {toaster} from '../../../toaster';
import {createEntityListFilter} from '../../../Utility/select';
import {LinkButton} from '../../Navigation/LinkButton';
import {EntitySelect} from '../../Select/EntitySelect';
import {createEntitySorter} from '../EntityList';

const itemsFilter = createEntityListFilter<Item>('name');
const skillsFilter = createEntityListFilter<Skill>('name');

const itemSorter = createEntitySorter<Item>('name');
const skillSorter = createEntitySorter<Skill>('name');

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
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): JSX.Element {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/ailments" />;

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

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
								<ItemEntitySelect
									config={{
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
							<FormGroup label="Actions">
								<MultiSelect
									items={[RecoveryAction.DODGE]}
									itemTextRenderer={this.renderRecoveryActionValue}
									onClear={this.onRecoveryActionsClear}
									onItemDeselect={this.onRecoveryActionsDeselect}
									onItemSelect={this.onRecoveryActionsSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.recoveryActions}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H2>Protection</H2>

					<Row>
						<Cell size={6}>
							<FormGroup label="Items">
								<ItemEntitySelect
									config={{
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
		Promise.all([
			ItemModel.list(null, {
				id: true,
				name: true,
			}).then(response => this.setState({
				items: response.data.sort(itemSorter),
			})),
			SkillModel.list(null, {
				id: true,
				name: true,
			}).then(response => this.setState({
				skills: response.data.sort(skillSorter),
			})),
		]).then(() => {
			const idParam = this.props.match.params.ailment;

			if (idParam === 'new') {
				this.setState({
					loading: false,
				});

				return;
			}

			AilmentModel.read(idParam).then(response => {
				const ailment = response.data;

				const protectionItemIds = ailment.protection.items.map(item => item.id);
				const protectionSkillIds = ailment.protection.skills.map(skill => skill.id);
				const recoveryItemIds = ailment.recovery.items.map(item => item.id);

				this.setState({
					description: ailment.description,
					loading: false,
					name: ailment.name,
					protectionItems: this.state.items.filter(item => protectionItemIds.indexOf(item.id) !== -1),
					protectionSkills: this.state.skills.filter(skill => protectionSkillIds.indexOf(skill.id) !== -1),
					recoveryActions: ailment.recovery.actions,
					recoveryItems: this.state.items.filter(item => recoveryItemIds.indexOf(item.id) !== -1),
				});
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
			description: this.state.description,
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
		});
	};
}
