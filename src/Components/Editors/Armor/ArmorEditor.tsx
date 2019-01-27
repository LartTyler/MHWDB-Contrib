import {Button, FormGroup, H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {IConstraintViolations} from '../../../Api/Error';
import {getAttributeDisplayName, Rank, rankNames, Slot} from '../../../Api/Model';
import {
	ArmorAttribute,
	armorAttributeNames,
	ArmorCraftingInfo,
	ArmorModel,
	ArmorType,
	armorTypeNames,
	Defense,
	isGender,
	Resistances,
} from '../../../Api/Models/Armor';
import {ArmorSet, ArmorSetModel} from '../../../Api/Models/ArmorSet';
import {Skill, SkillModel, SkillRank} from '../../../Api/Models/Skill';
import {cleanIntegerString} from '../../../Utility/number';
import {StringValues, toStringValues} from '../../../Utility/object';
import {filterStrings} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {IThemeAware, withTheme} from '../../Contexts/ThemeContext';
import {LinkButton} from '../../Navigation/LinkButton';
import {EntitySelect} from '../../Select/EntitySelect';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {IAttribute, toAttributes} from '../AttributeDropdowns';
import {AttributeEditorDialog} from '../AttributeEditorDialog';
import {AttributeTable} from '../AttributeTable';
import {createEntitySorter} from '../EntityList';
import {SkillDialog} from './SkillDialog';

const armorSetSorter = createEntitySorter<ArmorSet>('name');
const skillSorter = createEntitySorter<Skill>('name');

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
	showSkillDialog: boolean;
	skills: SkillRank[];
	slots: Slot[];
	type: ArmorType;
	violations: IConstraintViolations;
}

const ArmorSetEntitySelect = EntitySelect.ofType<ArmorSet>();

class ArmorEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		armorSet: null,
		attributes: [],
		crafting: null,
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
		showSkillDialog: false,
		skills: [],
		slots: [],
		type: null,
		violations: null,
	};

	private armorSets: ArmorSet[] = null;
	private skills: Skill[] = null;

	public componentDidMount(): void {
		const idParam = this.props.match.params.armor;

		Promise.all([
			idParam !== 'new' && ArmorModel.read(idParam),
			ArmorSetModel.list(null, {
				id: true,
				name: true,
			}),
			SkillModel.list(null, {
				id: true,
				name: true,
				'ranks.id': true,
				'ranks.level': true,
				'ranks.skill': true,
				'ranks.skillName': true,
			}),
		]).then(responses => {
			this.armorSets = responses[1].data.sort(armorSetSorter);
			this.skills = responses[2].data.sort(skillSorter);

			this.setState({
				loading: false,
			});

			if (!responses[0])
				return;

			const armor = responses[0].data;
			let armorSet: ArmorSet = null;

			if (armor.armorSet !== null)
				armorSet = this.armorSets.find(value => value.id === armor.armorSet.id) || null;

			const skills: SkillRank[] = [];
			const omittedSkills: Skill[] = [];

			for (const skill of this.skills) {
				const matched = armor.skills.find(rank => rank.skill === skill.id);

				if (!matched)
					continue;

				const matchedRank = skill.ranks.find(rank => rank.level === matched.level);

				if (matchedRank) {
					skills.push(matchedRank);
					omittedSkills.push(skill);
				}
			}

			this.setState({
				armorSet,
				attributes: toAttributes(armor.attributes),
				crafting: armor.crafting,
				defense: toStringValues(armor.defense),
				loading: false,
				name: armor.name,
				omittedSkills,
				rank: armor.rank,
				rarity: armor.rarity.toString(10),
				resistances: toStringValues(armor.resistances),
				skills,
				slots: armor.slots,
				type: armor.type,
			});
		});
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/armor" />;

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.onSave}>
					<Row>
						<Cell size={6}>
							<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
								<InputGroup name="name" onChange={this.onStringInputChange} value={this.state.name} />
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={6}>
							<FormGroup label="Type">
								<Select
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
								<InputGroup name="rarity" onChange={this.onRarityChange} value={this.state.rarity} />
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={5}>
							<FormGroup label="Armor Set">
								<ArmorSetEntitySelect
									config={{
										itemListPredicate: filterArmorSets,
										items: this.armorSets || [],
										loading: this.armorSets === null,
										multi: false,
										onItemSelect: this.onArmorSetSelect,
										popoverProps: {
											targetClassName: 'full-width',
										},
										selected: this.state.armorSet,
									}}
									labelField="name"
								/>
							</FormGroup>
						</Cell>

						<Cell className="text-right" size={1}>
							<FormGroup label={<span>&nbsp;</span>}>
								<Button icon="cross" onClick={this.onArmorSetClear} />
							</FormGroup>
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
									value={this.state.resistances.dragon}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<H3 style={{marginTop: 10}}>Attributes</H3>

					<AttributeTable attributes={this.state.attributes} />

					<Button icon="edit" onClick={this.onEditAttributesButtonClick}>
						Edit Attributes
					</Button>

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
								title: 'Level',
							},
							{
								align: 'right',
								render: record => (
									<Button icon="cross" minimal={true} onClick={() => this.onSkillRemove(record)} />
								),
								title: <div>&nbsp;</div>,
							},
						]}
						fullWidth={true}
						noDataPlaceholder="This item has no skills."
					/>

					<Button icon="plus" onClick={this.onSkillDialogShow}>
						Add Skill
					</Button>

					<Row align="end">
						<Cell size={1}>
							<LinkButton buttonProps={{disabled: this.state.saving, fill: true}} to="/edit/armor">
								Cancel
							</LinkButton>
						</Cell>

						<Cell size={1}>
							<Button fill={true} intent={Intent.PRIMARY} loading={this.state.saving}>
								Save
							</Button>
						</Cell>
					</Row>
				</form>

				<AttributeEditorDialog
					attributes={this.state.attributes}
					attributeNames={armorAttributeNames}
					isOpen={this.state.showAttributeEditorDialog}
					onAttributeAdd={this.onAttributeAdd}
					onAttributeDelete={this.onAttributeDelete}
					onAttributeKeyChange={this.onAttributeKeyChange}
					onAttributeValueChange={this.onAttributeValueChange}
					onClose={this.onAttributeEditorClose}
				/>

				<SkillDialog
					isOpen={this.state.showSkillDialog}
					omit={this.state.omittedSkills}
					onClose={this.onSkillDialogHide}
					onSave={this.onSkillAdd}
					skills={this.skills}
				/>
			</>
		);
	}

	private onArmorSetClear = () => this.setState({
		armorSet: null,
	});

	private onArmorSetSelect = (armorSet: ArmorSet) => this.setState({
		armorSet,
	});

	private onAttributeAdd = () => this.setState({
		attributes: [
			...this.state.attributes,
			{
				key: '',
				value: '',
			},
		],
	});

	private onAttributeDelete = (attribute: IAttribute) => this.setState({
		attributes: this.state.attributes.filter(item => item !== attribute),
	});

	private onAttributeKeyChange = (attribute: IAttribute, newKey: string) => {
		attribute.key = newKey;

		this.setState({
			attributes: [...this.state.attributes],
		});
	};

	private onAttributeValueChange = (attribute: IAttribute, newValue: string | number) => {
		attribute.value = newValue;

		this.setState({
			attributes: [...this.state.attributes],
		});
	};

	private onAttributeEditorClose = () => {
		const errors = [];

		for (const attribute of this.state.attributes) {
			if (attribute.key === ArmorAttribute.REQUIRED_GENDER && !isGender(attribute.value))
				errors.push(`${getAttributeDisplayName(attribute.key)} must be either "male" or "female"`);
		}

		if (errors.length) {
			alert(errors.map(error => `- ${error}`).join('\n'));

			return;
		}

		this.setState({
			showAttributeEditorDialog: false,
		});
	};

	private onDefenseBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const key = event.currentTarget.name as keyof Defense;

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
		const key = event.currentTarget.name as keyof Defense;

		this.setState({
			defense: {
				...this.state.defense,
				[key]: this.cleanIntegerInputValue(event.currentTarget.value),
			},
		});
	};

	private onEditAttributesButtonClick = () => this.setState({
		showAttributeEditorDialog: true,
	});

	private onRankSelect = (rank: Rank) => this.setState({
		rank,
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanIntegerString(event.currentTarget.value),
	});

	private onResistanceBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const key = event.currentTarget.name as keyof Resistances;

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
		const key = event.currentTarget.name as keyof Resistances;

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
	};

	private cleanIntegerInputValue = (value: string) => {
		let output = value.replace(/[^\d]/g, '');

		if (value.charAt(0) === '-')
			output = `-${output}`;

		return output;
	};
}

export const ArmorEditor = withTheme(withRouter(ArmorEditorComponent));
