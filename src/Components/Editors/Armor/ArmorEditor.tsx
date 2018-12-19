import {FormGroup, H2, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {ArmorType, armorTypeNames, IArmorCrafting, IArmorDefense, IArmorResistances} from '../../../Api/Objects/Armor';
import {IArmorSet} from '../../../Api/Objects/ArmorSet';
import {ISlot, Rank, rankNames} from '../../../Api/Objects/Entity';
import {ISkill} from '../../../Api/Objects/Skill';
import {cleanIntegerString} from '../../../Utility/number';
import {filterStrings} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IThemeAware, withThemeContext} from '../../Contexts/ThemeContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {EntitySelect} from '../../Select/EntitySelect';
import {createEntitySorter} from '../EntityList';

const armorSetSorter = createEntitySorter<IArmorSet>('name');
const sortArmorSets = (armorSets: IArmorSet[]) => armorSets.sort(armorSetSorter);

const filterArmorSets = (query: string, armorSets: IArmorSet[]) => {
	query = query.toLowerCase();

	return armorSets.filter(armorSet => armorSet.name.toLowerCase().indexOf(query) !== -1);
};

interface IAttribute {
	key: string;
	value: any;
}

interface IRouteProps {
	armor: string;
}

interface IProps extends IApiClientAware, IToasterAware, IThemeAware, RouteComponentProps<IRouteProps> {
}

interface IState {
	armorSet: IArmorSet;
	attributes: IAttribute[];
	controller: AbortController;
	crafting: IArmorCrafting;
	defense: IArmorDefense;
	loading: boolean;
	name: string;
	rank: Rank;
	rarity: string;
	redirect: boolean;
	resistances: IArmorResistances;
	saving: boolean;
	skills: ISkill[];
	slots: ISlot[];
	type: ArmorType;
}

class ArmorEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		armorSet: null,
		attributes: [],
		controller: null,
		crafting: null,
		defense: {
			augmented: 0,
			base: 0,
			max: 0,
		},
		loading: true,
		name: '',
		rank: null,
		rarity: '1',
		redirect: false,
		resistances: {
			dragon: 0,
			fire: 0,
			ice: 0,
			thunder: 0,
			water: 0,
		},
		saving: false,
		skills: [],
		slots: [],
		type: null,
	};

	public componentDidMount(): void {
		const idParam =  this.props.match.params.armor;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		const controller = new AbortController();

		this.setState({
			controller,
		});

		this.props.client.armor.get(parseInt(idParam, 10), null, controller.signal).then(armor => this.setState({
			armorSet: armor.armorSet,
			attributes: Object.keys(armor.attributes).map(key => ({
				key,
				value: armor.attributes[key],
			})),
			crafting: armor.crafting,
			defense: armor.defense,
			loading: false,
			name: armor.name,
			rank: armor.rank,
			rarity: armor.rarity.toString(10),
			resistances: armor.resistances,
			skills: armor.skills,
			slots: armor.slots,
			type: armor.type,
		}));
	}

	public componentWillUnmount(): void {
		if (this.state.controller)
			this.state.controller.abort();
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

						<Cell size={6}>
							<FormGroup label="Armor Set">
								<EntitySelect
									config={{
										itemListPredicate: filterArmorSets,
										multi: false,
										onItemSelect: this.onArmorSetSelect,
										popoverProps: {
											targetClassName: 'full-width',
										},
										selected: this.state.armorSet,
									}}
									labelField="name"
									onSelectionLoad={this.onArmorSetsLoad}
									provider={this.props.client.armorSets}
									sorter={sortArmorSets}
								/>
							</FormGroup>
						</Cell>
					</Row>
				</form>
			</>
		);
	}

	private onArmorSetsLoad = (armorSet: IArmorSet) => this.setState({
		armorSet,
	});

	private onArmorSetSelect = (armorSet: IArmorSet) => this.setState({
		armorSet,
	});

	private onRankSelect = (rank: Rank) => this.setState({
		rank,
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanIntegerString(event.currentTarget.value),
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
}

export const ArmorEditor = withApiClient(withToasterContext(withThemeContext(withRouter(ArmorEditorComponent))));
