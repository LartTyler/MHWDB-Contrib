import {Button, FormGroup, H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
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
import {ArmorSet} from '../../../Api/Models/ArmorSet';
import {Skill} from '../../../Api/Models/Skill';
import {cleanIntegerString} from '../../../Utility/number';
import {StringValues, toStringValues} from '../../../Utility/object';
import {filterStrings} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {IThemeAware, withTheme} from '../../Contexts/ThemeContext';
import {EntitySelect} from '../../Select/EntitySelect';
import {IAttribute, toAttributes} from '../AttributeDropdowns';
import {AttributeEditorDialog} from '../AttributeEditorDialog';
import {AttributeTable} from '../AttributeTable';
import {createEntitySorter} from '../EntityList';

const armorSetSorter = createEntitySorter<ArmorSet>('name');
const sortArmorSets = (armorSets: ArmorSet[]) => armorSets.sort(armorSetSorter);

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
	armorSets: ArmorSet[];
	attributes: IAttribute[];
	crafting: ArmorCraftingInfo;
	defense: StringValues<Defense>;
	loading: boolean;
	name: string;
	rank: Rank;
	rarity: string;
	redirect: boolean;
	resistances: StringValues<Resistances>;
	saving: boolean;
	showAttributeEditorDialog: boolean;
	skills: Skill[];
	slots: Slot[];
	type: ArmorType;
}

const ArmorSetEntitySelect = EntitySelect.ofType<ArmorSet>();

class ArmorEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		armorSet: null,
		armorSets: null,
		attributes: [],
		crafting: null,
		defense: {
			augmented: '0',
			base: '0',
			max: '0',
		},
		loading: true,
		name: '',
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
		skills: [],
		slots: [],
		type: null,
	};

	public componentDidMount(): void {
		const idParam = this.props.match.params.armor;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		ArmorModel.read(idParam).then(response => {
			const armor = response.data;

			this.setState({
				armorSet: armor.armorSet,
				attributes: toAttributes(armor.attributes),
				crafting: armor.crafting,
				defense: toStringValues(armor.defense),
				loading: false,
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
							<FormGroup label="Name" labelFor="name">
								<InputGroup name="name" onChange={this.onStringInputChange} value={this.state.name} />
							</FormGroup>
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
							<FormGroup label="Rarity">
								<InputGroup name="rarity" onChange={this.onRarityChange} value={this.state.rarity} />
							</FormGroup>
						</Cell>

						<Cell size={5}>
							<FormGroup label="Armor Set">
								<ArmorSetEntitySelect
									config={{
										itemListPredicate: filterArmorSets,
										items: this.state.armorSets || [],
										loading: this.state.armorSets === null,
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
							<FormGroup label="Base" labelFor="base">
								<InputGroup
									name="base"
									onBlur={this.onDefenseBlur}
									onChange={this.onDefenseChange}
									value={this.state.defense.base}
								/>
							</FormGroup>
						</Cell>

						<Cell size={4}>
							<FormGroup label="Max (Not Augmented)" labelFor="max">
								<InputGroup
									name="max"
									onBlur={this.onDefenseBlur}
									onChange={this.onDefenseChange}
									value={this.state.defense.max}
								/>
							</FormGroup>
						</Cell>

						<Cell size={4}>
							<FormGroup label="Max (Augmented)" labelFor="augmented">
								<InputGroup
									name="augmented"
									onBlur={this.onDefenseBlur}
									onChange={this.onDefenseChange}
									value={this.state.defense.augmented}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H3 style={{marginTop: 10}}>Resistances</H3>

					<Row>
						<Cell size={4}>
							<FormGroup label="Fire" labelFor="fire">
								<InputGroup
									name="fire"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									value={this.state.resistances.fire}
								/>
							</FormGroup>
						</Cell>

						<Cell size={4}>
							<FormGroup label="Water" labelFor="water">
								<InputGroup
									name="water"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									value={this.state.resistances.water}
								/>
							</FormGroup>
						</Cell>

						<Cell size={4}>
							<FormGroup label="Thunder" labelFor="thunder">
								<InputGroup
									name="thunder"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									value={this.state.resistances.thunder}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell offset={2} size={4}>
							<FormGroup label="Ice" labelFor="ice">
								<InputGroup
									name="ice"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									value={this.state.resistances.ice}
								/>
							</FormGroup>
						</Cell>

						<Cell size={4}>
							<FormGroup label="Dragon" labelFor="dragon">
								<InputGroup
									name="dragon"
									onBlur={this.onResistanceBlur}
									onChange={this.onResistanceChange}
									value={this.state.resistances.dragon}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H3 style={{marginTop: 10}}>Attributes</H3>

					<AttributeTable attributes={this.state.attributes} />

					<Button icon="edit" onClick={this.onEditAttributesButtonClick}>
						Edit Attributes
					</Button>
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
