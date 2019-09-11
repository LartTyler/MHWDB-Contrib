import {H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, MultiSelect, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IConstraintViolations, isConstraintViolationError} from '../../../Api/Error';
import {Slot} from '../../../Api/Model';
import {attributeLabels, AttributeName, IAttribute} from '../../../Api/Models/attributes';
import {
	Durability,
	Elderseal,
	hasDurabilityFunctionality,
	isDurabilityFunctionalityType,
	WeaponAttributes,
	WeaponCrafting,
	WeaponElement,
	WeaponModel,
	WeaponType,
	weaponTypeLabels,
} from '../../../Api/Models/Weapon';
import {BowCoating, hasBowCoatingFunctionality, isBowCoatingFunctionalityType} from '../../../Api/Models/Weapons/Bow';
import {
	hasPhialFunctionality,
	isPhialFunctionalityType,
	PhialInfo,
	PhialTypes,
} from '../../../Api/Models/Weapons/phial';
import {toaster} from '../../../toaster';
import {cleanNumberString} from '../../../Utility/number';
import {filterStrings} from '../../../Utility/select';
import {ucfirst, ucwords} from '../../../Utility/string';
import {Role} from '../../RequireRole';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {AttributesEditor} from '../Attributes/AttributesEditor';
import {EditorButtons} from '../EditorButtons';
import {Slots} from '../Slots';
import {DurabilityEditor} from './DurabilityEditor';
import {ElementEditor} from './ElementEditor';
import {PhialInfo as PhialInfoComponent} from './PhialInfo';
import {WeaponCraftingEditor} from './WeaponCraftingEditor';

interface IRouteProps {
	weaponType: WeaponType;
	weapon: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	allowedAttributes: AttributeName[];
	attack: string;
	attributes: IAttribute[];
	coatings: BowCoating[];
	crafting: WeaponCrafting;
	durability: Durability[];
	elderseal: Elderseal;
	elements: WeaponElement[];
	loading: boolean;
	name: string;
	phial: PhialInfo;
	rarity: string;
	redirect: boolean;
	saving: boolean;
	slots: Slot[];
	violations: IConstraintViolations;
}

class WeaponEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		allowedAttributes: [],
		attack: '',
		attributes: [],
		coatings: [],
		crafting: {
			branches: [],
			craftable: false,
			craftingMaterials: [],
			previous: null,
			upgradeMaterials: [],
		},
		durability: [],
		elderseal: null,
		elements: [],
		loading: true,
		name: '',
		phial: {},
		rarity: '0',
		redirect: false,
		saving: false,
		slots: [],
		violations: {},
	};

	public componentDidMount(): void {
		const allowedAttributes = [
			AttributeName.AFFINITY,
			AttributeName.DAMAGE_TYPE,
			AttributeName.DEFENSE,
		];

		switch (this.props.match.params.weaponType) {
			case WeaponType.GUNLANCE:
				allowedAttributes.push(AttributeName.GL_SHELLING_TYPE);

				break;

			case WeaponType.INSECT_GLAIVE:
				allowedAttributes.push(AttributeName.IG_BOOST_TYPE);

				break;

			case WeaponType.LIGHT_BOWGUN:
			case WeaponType.HEAVY_BOWGUN:
				allowedAttributes.push(
					AttributeName.AMMO_CAPACITIES,
					AttributeName.DEVIATION,
					AttributeName.SPECIAL_AMMO,
				);

				break;
		}

		const id = this.props.match.params.weapon;

		if (id === 'new') {
			this.setState({
				allowedAttributes,
				loading: false,
			});

			if (!WeaponModel.isRanged(this.props.match.params.weaponType)) {
				this.setState({
					durability: (new Array(6) as Durability[]).fill({
						blue: 0,
						green: 0,
						orange: 0,
						red: 0,
						white: 0,
						yellow: 0,
					}),
				});
			}

			return;
		}

		WeaponModel.read(id).then(response => {
			const weapon = response.data;
			const state: Pick<IState, 'durability' | 'phial' | 'coatings'> = {
				coatings: [],
				durability: [],
				phial: {},
			};

			if (hasDurabilityFunctionality(weapon)) {
				const durability = weapon.durability;

				for (let i = durability.length; i < 6; i++) {
					durability.push({
						blue: 0,
						green: 0,
						orange: 0,
						red: 0,
						white: 0,
						yellow: 0,
					});
				}

				state.durability = durability;
			}

			if (hasPhialFunctionality(weapon))
				state.phial = weapon.phial;

			if (hasBowCoatingFunctionality(weapon))
				state.coatings = weapon.coatings;

			const attributes: IAttribute[] = [];

			for (const [attribute, value] of Object.entries(weapon.attributes)) {
				if (typeof attributeLabels[attribute as AttributeName] === 'undefined')
					continue;

				attributes.push({
					key: attribute as AttributeName,
					value,
				});
			}

			this.setState({
				...state,
				allowedAttributes,
				attack: weapon.attack.display.toString(10),
				attributes,
				crafting: weapon.crafting,
				elderseal: weapon.elderseal,
				elements: weapon.elements,
				loading: false,
				name: weapon.name,
				rarity: weapon.rarity.toString(10),
				slots: weapon.slots,
			});
		});
	}

	public render(): React.ReactNode {
		const type = this.props.match.params.weaponType;

		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to={`/objects/weapons/${type}`} />;

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

					<Cell size={3}>
						<ValidationAwareFormGroup label="Rarity" labelFor="rarity" violations={this.state.violations}>
							<InputGroup
								name="rarity"
								onChange={this.onRarityChange}
								readOnly={readOnly}
								value={this.state.rarity}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={3}>
						<ValidationAwareFormGroup
							label="Attack (In-Game Value)"
							labelFor="attack.dispaly"
							violations={this.state.violations}
						>
							<InputGroup
								name="attack.display"
								onChange={this.onAttackChange}
								readOnly={readOnly}
								value={this.state.attack}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={4}>
						<ValidationAwareFormGroup
							label="Elderseal"
							labelFor="elderseal"
							violations={this.state.violations}
						>
							<Select
								disabled={readOnly}
								filterable={false}
								items={Object.values(Elderseal)}
								itemTextRenderer={ucfirst}
								onItemSelect={this.onEldersealSelect}
								popoverProps={{
									targetClassName: 'full-width',
								}}
								selected={this.state.elderseal}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					{isPhialFunctionalityType(type) && (
						<Cell size={4}>
							<PhialInfoComponent
								damage={this.state.phial.damage ? this.state.phial.damage.toString(10) : null}
								onChange={this.onPhialInfoChange}
								type={this.state.phial.type}
							/>
						</Cell>
					)}

					{isBowCoatingFunctionalityType(type) && (
						<Cell size={6}>
							<ValidationAwareFormGroup
								label="Coatings"
								labelFor="coatings"
								violations={this.state.violations}
							>
								<MultiSelect
									itemListPredicate={filterStrings}
									items={Object.values(BowCoating)}
									itemTextRenderer={ucwords}
									onClear={this.onBowCoatingsClear}
									onItemDeselect={this.onBowCoatingDeselect}
									onItemSelect={this.onBowCoatingSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.coatings}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					)}
				</Row>

				<Row>
					<Cell size={8}>
						<H3>Attributes</H3>

						<AttributesEditor
							accepted={this.state.allowedAttributes}
							attributes={this.state.attributes}
							onChange={this.onAttributesChange}
							readOnly={readOnly}
						/>
					</Cell>

					<Cell size={4}>
						<H3>Slots</H3>

						<Slots slots={this.state.slots} onChange={this.onSlotsChange} readOnly={readOnly} />
					</Cell>
				</Row>

				<H3 style={{marginTop: 15}}>Crafting</H3>

				<WeaponCraftingEditor
					crafting={this.state.crafting}
					readOnly={readOnly}
					weaponId={this.props.match.params.weapon}
					weaponType={type}
				/>

				<Row>
					{isDurabilityFunctionalityType(type) && (
						<Cell size={6}>
							<H3 style={{marginTop: 15}}>Durability</H3>

							<DurabilityEditor durability={this.state.durability} readOnly={readOnly} />
						</Cell>
					)}

					<Cell size={!isDurabilityFunctionalityType(type) ? 12 : 6}>
						<H3 style={{marginTop: 15}}>Elements</H3>

						<ElementEditor
							elements={this.state.elements}
							onElementAdd={this.onElementAdd}
							onElementChange={this.onElementChange}
							onElementRemove={this.onElementRemove}
							readOnly={readOnly}
						/>
					</Cell>
				</Row>

				<EditorButtons
					onClose={this.onClose}
					onSave={this.save}
					readOnly={readOnly}
					saving={this.state.saving}
				/>
			</form>
		);
	}

	private onAttackChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		attack: cleanNumberString(event.currentTarget.value, false),
	});

	private onAttributesChange = (attributes: IAttribute[]) => this.setState({
		attributes,
	});

	private onBowCoatingsClear = () => this.setState({
		coatings: [],
	});

	private onBowCoatingDeselect = (target: BowCoating) => this.setState({
		coatings: this.state.coatings.filter(coating => coating !== target),
	});

	private onBowCoatingSelect = (coating: BowCoating) => this.setState({
		coatings: [...this.state.coatings, coating],
	});

	private onClose = () => this.setState({
		redirect: true,
	});

	private onEldersealSelect = (elderseal: Elderseal) => this.setState({
		elderseal,
	});

	private onElementAdd = (element: WeaponElement) => this.setState({
		elements: [...this.state.elements, element],
	});

	private onElementChange = () => this.setState({
		elements: [...this.state.elements],
	});

	private onElementRemove = (target: WeaponElement) => this.setState({
		elements: this.state.elements.filter(element => element !== target),
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onPhialInfoChange = (type: PhialTypes, damage: number) => this.setState({
		phial: {
			damage,
			type,
		},
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanNumberString(event.currentTarget.value, false),
	});

	private onSlotsChange = (slots: Slot[]) => this.setState({
		slots,
	});

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const crafting = this.state.crafting;

		const payload: any = {
			attack: {
				display: parseInt(this.state.attack, 10),
			},
			attributes: this.state.attributes.reduce((collector, attribute) => {
				collector[attribute.key] = attribute.value;

				return collector;
			}, {} as WeaponAttributes),
			crafting: {
				craftable: crafting.craftable,
				craftingMaterials: crafting.craftingMaterials.map(cost => ({
					item: cost.item.id,
					quantity: cost.quantity,
				})),
				previous: crafting.previous,
				upgradeMaterials: crafting.upgradeMaterials.map(cost => ({
					item: cost.item.id,
					quantity: cost.quantity,
				})),
			},
			elderseal: this.state.elderseal,
			elements: this.state.elements,
			name: this.state.name,
			rarity: parseInt(this.state.rarity, 10),
			slots: this.state.slots,
		};

		payload.type = this.props.match.params.weaponType;

		if (isPhialFunctionalityType(payload.type))
			payload.phial = this.state.phial;

		if (isDurabilityFunctionalityType(payload.type))
			payload.durability = this.state.durability;

		if (isBowCoatingFunctionalityType(payload.type))
			payload.coatings = this.state.coatings;

		const idParam = this.props.match.params.weapon;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = WeaponModel.create(payload, {id: true});
		else
			promise = WeaponModel.update(idParam, payload, {id: true});

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} ${idParam === 'new' ? 'created' : 'saved'}.`,
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

export const WeaponEditor = withRouter(WeaponEditorComponent);
