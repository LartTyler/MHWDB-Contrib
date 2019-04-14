import {Button, ButtonGroup, Classes, FormGroup, H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IConstraintViolations, isConstraintViolationError} from '../../../Api/Error';
import {Rank, rankNames, Slot} from '../../../Api/Model';
import {
	ArmorCraftingInfo,
	ArmorModel,
	ArmorPayload,
	ArmorType,
	armorTypeNames,
	Defense,
	IArmorAttributes,
	Resistances,
} from '../../../Api/Models/Armor';
import {ArmorSet, ArmorSetModel} from '../../../Api/Models/ArmorSet';
import {AttributeName, IAttribute} from '../../../Api/Models/attributes';
import {CraftingCost, Item} from '../../../Api/Models/Item';
import {Skill, SkillModel, SkillRank} from '../../../Api/Models/Skill';
import {toaster} from '../../../toaster';
import {cleanPositiveIntegerString} from '../../../Utility/number';
import {StringValues, toStringValues} from '../../../Utility/object';
import {filterStrings} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {IThemeAware, withTheme} from '../../Contexts/ThemeContext';
import {Role} from '../../RequireRole';
import {EntitySelect} from '../../Select/EntitySelect';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {AttributesEditor} from '../Attributes/AttributesEditor';
import {CraftingCostDialog} from '../CraftingCostDialog';
import {EditorButtons} from '../EditorButtons';
import {SkillDialog} from '../SkillDialog';
import {skillSorter} from '../Skills/SkillList';
import {Slots} from '../Slots';

const armorAttributes = [
	AttributeName.GENDER,
];

const filterArmorSets = (query: string, armorSets: ArmorSet[]) => {
	query = query.toLowerCase();

	return armorSets.filter(armorSet => armorSet.name.toLowerCase().indexOf(query) !== -1);
};

interface IRouteProps {
	armor: string;
}

interface IProps extends IThemeAware, RouteComponentProps<IRouteProps> {
}

interface IState {
	armorSet: ArmorSet;
	armorSetList: ArmorSet[];
	attributes: IAttribute[];
	crafting: ArmorCraftingInfo;
	defense: StringValues<Defense>;
	loading: boolean;
	name: string;
	omittedSkills: Skill[];
	rank: Rank;
	rarity: string;
	redirect: boolean;
	resistances: StringValues<Resistances>;
	saving: boolean;
	showAttributeEditorDialog: boolean;
	showCraftingCostDialog: boolean;
	showSkillDialog: boolean;
	skillList: Skill[];
	skills: SkillRank[];
	slots: Slot[];
	type: ArmorType;
	violations: IConstraintViolations;
}

const ArmorSetEntitySelect = EntitySelect.ofType<ArmorSet>();

class ArmorEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		armorSet: null,
		armorSetList: null,
		attributes: [],
		crafting: {
			materials: [],
		},
		defense: {
			augmented: '0',
			base: '0',
			max: '0',
		},
		loading: true,
		name: '',
		omittedSkills: [],
		rank: null,
		rarity: '1',
		redirect: false,
		resistances: {
			dragon: '0',
			fire: '0',
			ice: '0',
			thunder: '0',
			water: '0',
		},
		saving: false,
		showAttributeEditorDialog: false,
		showCraftingCostDialog: false,
		showSkillDialog: false,
		skillList: null,
		skills: [],
		slots: [],
		type: null,
		violations: null,
	};

	public componentDidMount(): void {
		const idParam = this.props.match.params.armor;

		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = Promise.resolve();
		else {
			promise = ArmorModel.read(idParam).then(response => {
				const armor = response.data;

				this.setState({
					armorSet: armor.armorSet,
					attributes: Object.entries(armor.attributes).map(([key, value]) => ({
						key: key as AttributeName,
						value,
					})),
					crafting: armor.crafting,
					defense: toStringValues(armor.defense),
					name: armor.name,
					rank: armor.rank,
					rarity: armor.rarity.toString(10),
					resistances: toStringValues(armor.resistances),
					skills: armor.skills,
					slots: armor.slots,
					type: armor.type,
				});
			});
		}

		promise.then(() => {
			this.setState({
				loading: false,
			});

			ArmorSetModel.list(null, {
				id: true,
				name: true,
			}).then(response => {
				const armorSetList = response.data;
				let armorSet = this.state.armorSet;

				if (armorSet)
					armorSet = armorSetList.find(set => set.id === armorSet.id) || null;

				this.setState({
					armorSet,
					armorSetList,
				});
			});

			SkillModel.list(null, {
				id: true,
				name: true,
				'ranks.id': true,
				'ranks.level': true,
				'ranks.skill': true,
				'ranks.skillName': true,
			}).then(response => {
				const skills: SkillRank[] = [];
				const omittedSkills: Skill[] = [];

				for (const skill of response.data) {
					const matched = this.state.skills.find(rank => rank.skill === skill.id);

					if (!matched)
						continue;

					const matchedRank = skill.ranks.find(rank => rank.level === matched.level);

					if (matchedRank) {
						skills.push(matchedRank);
						omittedSkills.push(skill);
					}
				}

				this.setState({
					omittedSkills,
					skillList: response.data.sort(skillSorter),
					skills,
				});
			});
		});
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/objects/armor" />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.onSave}>
					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
								<InputGroup
									name="name"
									onChange={this.onStringInputChange}
									readOnly={readOnly}
									value={this.state.name}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={6}>
							<FormGroup label="Armor Set">
								<ButtonGroup fill={true}>
									<ArmorSetEntitySelect
										config={{
											disabled: readOnly,
											itemListPredicate: filterArmorSets,
											items: this.state.armorSetList || [],
											loading: this.state.armorSetList === null,
											multi: false,
											onItemSelect: this.onArmorSetSelect,
											popoverProps: {
												className: 'full-width',
												targetClassName: 'full-width',
											},
											selected: this.state.armorSet,
										}}
										labelField="name"
									/>

									{!readOnly && this.state.armorSetList !== null && (
										<Button className={Classes.FIXED} icon="cross" onClick={this.onArmorSetClear} />
									)}
								</ButtonGroup>
							</FormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={6}>
							<FormGroup label="Type">
								<Select
									disabled={readOnly}
									itemListPredicate={filterStrings}
									items={armorTypeNames}
									itemTextRenderer={ucfirst}
									onItemSelect={this.onTypeSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.type}
								/>
							</FormGroup>
						</Cell>

						<Cell size={6}>
							<FormGroup label="Rank">
								<Select
									disabled={readOnly}
									itemListPredicate={filterStrings}
									items={rankNames}
									itemTextRenderer={ucfirst}
									onItemSelect={this.onRankSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.rank}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup
								label="Rarity"
								labelFor="rarity"
								violations={this.state.violations}
							>
								<InputGroup
									name="rarity"
									onChange={this.onRarityChange}
									readOnly={readOnly}
									value={this.state.rarity}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<H3 style={{marginTop: 10}}>Defense</H3>

					<Row>
						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Base"
								labelFor="defense.base"
								violations={this.state.violations}
							>
								<InputGroup
									name="defense.base"
									onBlur={this.onDefenseBlur}
									onChange={this.onDefenseChange}
									readOnly={readOnly}
									value={this.state.defense.base}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Max (Not Augmented)"
								labelFor="defense.max"
								violations={this.state.violations}
							>
								<InputGroup
									name="defense.max"
									onBlur={this.onDefenseBlur}
									onChange={this.onDefenseChange}
									readOnly={readOnly}
									value={this.state.defense.max}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Max (Augmented)"
								labelFor="defense.augmented"
								violations={this.state.violations}
							>
								<InputGroup
									name="defense.augmented"
									onBlur={this.onDefenseBlur}
									onChange={this.onDefenseChange}
									readOnly={readOnly}
									value={this.state.defense.augmented}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<H3 style={{marginTop: 10}}>Resistances</H3>

					<Row>
						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Fire"
								labelFor="resistances.fire"
								violations={this.state.violations}
							>
								<InputGroup
									name="resistances.fire"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									readOnly={readOnly}
									value={this.state.resistances.fire}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Water"
								labelFor="resistances.water"
								violations={this.state.violations}
							>
								<InputGroup
									name="resistances.water"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									readOnly={readOnly}
									value={this.state.resistances.water}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Thunder"
								labelFor="resistances.thunder"
								violations={this.state.violations}
							>
								<InputGroup
									name="resistances.thunder"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									readOnly={readOnly}
									value={this.state.resistances.thunder}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell offset={2} size={4}>
							<ValidationAwareFormGroup
								label="Ice"
								labelFor="resistances.ice"
								violations={this.state.violations}
							>
								<InputGroup
									name="resistances.ice"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									readOnly={readOnly}
									value={this.state.resistances.ice}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Dragon"
								labelFor="resistances.dragon"
								violations={this.state.violations}
							>
								<InputGroup
									name="resistances.dragon"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									readOnly={readOnly}
									value={this.state.resistances.dragon}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<Row style={{marginTop: 10}}>
						<Cell size={6}>
							<H3>Slots</H3>

							<Slots
								slots={this.state.slots}
								onChange={this.onSlotsChange}
								readOnly={readOnly}
							/>
						</Cell>

						<Cell size={6}>
							<H3>Attributes</H3>

							<AttributesEditor
								accepted={armorAttributes}
								attributes={this.state.attributes}
								onChange={this.onAttributesChange}
								readOnly={readOnly}
							/>
						</Cell>
					</Row>

					<H3 style={{marginTop: 20}}>Skills</H3>

					<Table
						dataSource={this.state.skills}
						columns={[
							{
								dataIndex: 'skillName',
								title: 'Name',
							},
							{
								dataIndex: 'level',
								style: {
									width: 100,
								},
								title: 'Level',
							},
							{
								align: 'right',
								render: record => !readOnly && (
									<Button icon="cross" minimal={true} onClick={() => this.onSkillRemove(record)} />
								),
								title: <div>&nbsp;</div>,
							},
						]}
						fullWidth={true}
						loading={this.state.skillList === null}
						noDataPlaceholder={<div>This item has no skills.</div>}
						rowKey="id"
					/>

					{!readOnly && (
						<Button icon="plus" onClick={this.onSkillDialogShow} style={{marginTop: 10}}>
							Add Skill
						</Button>
					)}

					<H3 style={{marginTop: 20}}>Crafting</H3>

					<Table
						dataSource={this.state.crafting.materials}
						columns={[
							{
								render: cost => cost.item.name,
								title: 'Item',
							},
							{
								dataIndex: 'quantity',
								style: {
									width: 100,
								},
								title: 'Quantity',
							},
							{
								align: 'right',
								render: cost => !readOnly && (
									<Button
										icon="cross"
										minimal={true}
										onClick={() => this.onCraftingCostRemove(cost)}
									/>
								),
								title: <div>&nbsp;</div>,
							},
						]}
						fullWidth={true}
						noDataPlaceholder={<div style={{marginBottom: 10}}>This item has no crafting cost.</div>}
						rowKey={cost => cost.item.id.toString(10)}
					/>

					{!readOnly && (
						<Button icon="plus" onClick={this.onCraftingCostDialogShow}>
							Add Item
						</Button>
					)}

					<EditorButtons
						onClose={this.onClose}
						onSave={this.onSave}
						readOnly={readOnly}
						saving={this.state.saving}
					/>
				</form>

				{!readOnly && (
					<>
						<SkillDialog
							isOpen={this.state.showSkillDialog}
							omit={this.state.omittedSkills}
							onClose={this.onSkillDialogHide}
							onSave={this.onSkillAdd}
							skills={this.state.skillList}
						/>

						<CraftingCostDialog
							isOpen={this.state.showCraftingCostDialog}
							onClose={this.onCraftingCostDialogHide}
							onSubmit={this.onCraftingCostAdd}
						/>
					</>
				)}
			</>
		);
	}

	private onArmorSetClear = () => this.setState({
		armorSet: null,
	});

	private onArmorSetSelect = (armorSet: ArmorSet) => this.setState({
		armorSet,
	});

	private onAttributesChange = (attributes: IAttribute[]) => this.setState({
		attributes,
	});

	private onClose = () => this.setState({
		redirect: true,
	});

	private onCraftingCostDialogHide = () => this.setState({
		showCraftingCostDialog: false,
	});

	private onCraftingCostDialogShow = () => this.setState({
		showCraftingCostDialog: true,
	});

	private onCraftingCostAdd = (cost: CraftingCost) => this.setState({
		crafting: {
			materials: [...this.state.crafting.materials, cost],
		},
		showCraftingCostDialog: false,
	});

	private onCraftingCostRemove = (target: CraftingCost) => this.setState({
		crafting: {
			materials: this.state.crafting.materials.filter(cost => cost !== target),
		},
	});

	private onDefenseBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const name = event.currentTarget.name;
		const key = name.substr(name.lastIndexOf('.') + 1) as keyof Defense;

		if (this.state.defense[key].length > 0 && this.state.defense[key] !== '-')
			return;

		this.setState({
			defense: {
				...this.state.defense,
				[key]: '0',
			},
		});
	};

	private onDefenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.currentTarget.name;
		const key = name.substr(name.lastIndexOf('.') + 1) as keyof Defense;

		this.setState({
			defense: {
				...this.state.defense,
				[key]: this.cleanIntegerInputValue(event.currentTarget.value),
			},
		});
	};

	private onRankSelect = (rank: Rank) => this.setState({
		rank,
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanPositiveIntegerString(event.currentTarget.value),
	});

	private onResistanceBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const name = event.currentTarget.name;
		const key = name.substr(name.lastIndexOf('.') + 1) as keyof Resistances;

		if (this.state.resistances[key].length > 0 && this.state.resistances[key] !== '-')
			return;

		this.setState({
			resistances: {
				...this.state.resistances,
				[key]: '0',
			},
		});
	};

	private onResistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.currentTarget.name;
		const key = name.substr(name.lastIndexOf('.') + 1) as keyof Resistances;

		this.setState({
			resistances: {
				...this.state.resistances,
				[key]: this.cleanIntegerInputValue(event.currentTarget.value),
			},
		});
	};

	private onSkillDialogHide = () => this.setState({
		showSkillDialog: false,
	});

	private onSkillDialogShow = () => this.setState({
		showSkillDialog: true,
	});

	private onSkillAdd = (rank: SkillRank, skill: Skill) => this.setState({
		omittedSkills: [...this.state.omittedSkills, skill],
		showSkillDialog: false,
		skills: [...this.state.skills, rank],
	});

	private onSkillRemove = (target: SkillRank) => this.setState({
		omittedSkills: this.state.omittedSkills.filter(skill => skill.id !== target.skill),
		skills: this.state.skills.filter(rank => rank !== target),
	});

	private onSlotsChange = (slots: Slot[]) => this.setState({
		slots,
	});

	// @ts-ignore
	private onStringInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		[event.currentTarget.name]: event.currentTarget.value,
	});

	private onTypeSelect = (type: ArmorType) => this.setState({
		type,
	});

	private onSave = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const payload: ArmorPayload = {
			armorSet: this.state.armorSet ? this.state.armorSet.id : null,
			attributes: this.state.attributes.reduce((collector, attribute) => {
				collector[attribute.key] = attribute.value;

				return collector;
			}, {} as IArmorAttributes),
			crafting: {
				materials: this.state.crafting.materials.map(cost => ({
					item: cost.item.id,
					quantity: cost.quantity,
				})),
			},
			defense: {
				augmented: parseInt(this.state.defense.augmented, 10),
				base: parseInt(this.state.defense.base, 10),
				max: parseInt(this.state.defense.max, 10),
			},
			name: this.state.name,
			rank: this.state.rank,
			rarity: parseInt(this.state.rarity, 10),
			resistances: {
				dragon: parseInt(this.state.resistances.dragon, 10),
				fire: parseInt(this.state.resistances.fire, 10),
				ice: parseInt(this.state.resistances.ice, 10),
				thunder: parseInt(this.state.resistances.thunder, 10),
				water: parseInt(this.state.resistances.water, 10),
			},
			skills: this.state.skills.map(rank => ({
				level: rank.level,
				skill: rank.skill,
			})),
			slots: this.state.slots,
			type: this.state.type,
		};

		const idParam = this.props.match.params.armor;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = ArmorModel.create(payload);
		else
			promise = ArmorModel.update(idParam, payload);

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} has been ${idParam === 'new' ? 'created' : 'updated'}.`,
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

			this.setState({
				saving: false,
			});
		});
	};

	private cleanIntegerInputValue = (value: string) => {
		let output = value.replace(/[^\d]/g, '');

		if (value.charAt(0) === '-')
			output = `-${output}`;

		return output;
	};
}

export const ArmorEditor = withTheme(withRouter(ArmorEditorComponent));
