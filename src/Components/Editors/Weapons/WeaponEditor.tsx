import {H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, MultiSelect, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IValidationFailures, isValidationFailedError} from '../../../Api/Error';
import {Slot} from '../../../Api/Model';
import {attributeLabels, AttributeName, IAttribute} from '../../../Api/Models/attributes';
import {
	DamageType,
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
import {
	AmmoCapacity,
	ammoLevels,
	AmmoType,
	hasAmmoFunctionality,
	isAmmoFunctionalityType,
} from '../../../Api/Models/Weapons/ammo';
import {BowCoating, hasBowCoatingFunctionality, isBowCoatingFunctionalityType} from '../../../Api/Models/Weapons/Bow';
import {
	Deviation,
	hasDeviationFunctionality,
	isDeviationFunctionalityType,
} from '../../../Api/Models/Weapons/deviation';
import {IShellingInfo, ShellingType} from '../../../Api/Models/Weapons/Gunlance';
import {InsectGlaiveBoostType} from '../../../Api/Models/Weapons/InsectGlaive';
import {
	hasPhialFunctionality,
	isPhialFunctionalityType,
	PhialInfo,
	PhialTypes,
} from '../../../Api/Models/Weapons/phial';
import {
	hasSpecialAmmoFunctionality,
	HeavyBowgunSpecialAmmo,
	isSpecialAmmoFunctionalityType,
	LightBowgunSpecialAmmo,
} from '../../../Api/Models/Weapons/special-ammo';
import {toaster} from '../../../toaster';
import {cleanNumberString} from '../../../Utility/number';
import {filterStrings} from '../../../Utility/select';
import {ucfirst, ucwords} from '../../../Utility/string';
import {Role} from '../../RequireRole';
import {ClearableSelect} from '../../Select/ClearableSelect';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {AttributesEditor} from '../Attributes/AttributesEditor';
import {EditorButtons} from '../EditorButtons';
import {Slots} from '../Slots';
import {AmmoCapacityEditor} from './AmmoCapacityEditor';
import {DurabilityEditor} from './DurabilityEditor';
import {ElementEditor} from './ElementEditor';
import {PhialInfo as PhialInfoComponent} from './PhialInfo';
import {ShellingInfo} from './ShellingInfo';
import {WeaponCraftingEditor} from './WeaponCraftingEditor';

interface IRouteProps {
	weaponType: WeaponType;
	weapon: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	allowedAttributes: AttributeName[];
	ammo: AmmoCapacity[];
	attack: string;
	attributes: IAttribute[];
	boostType: InsectGlaiveBoostType;
	coatings: BowCoating[];
	crafting: WeaponCrafting;
	damageType: DamageType;
	deviation: Deviation;
	durability: Durability[];
	elderseal: Elderseal;
	elements: WeaponElement[];
	loading: boolean;
	name: string;
	phial: PhialInfo;
	rarity: string;
	redirect: boolean;
	saving: boolean;
	shelling: IShellingInfo;
	slots: Slot[];
	specialAmmo: LightBowgunSpecialAmmo | HeavyBowgunSpecialAmmo;
	violations: IValidationFailures;
}

class WeaponEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		allowedAttributes: [],
		ammo: [],
		attack: '',
		attributes: [],
		boostType: null,
		coatings: [],
		crafting: {
			branches: [],
			craftable: false,
			craftingMaterials: [],
			previous: null,
			upgradeMaterials: [],
		},
		damageType: null,
		deviation: null,
		durability: [],
		elderseal: null,
		elements: [],
		loading: true,
		name: '',
		phial: {},
		rarity: '0',
		redirect: false,
		saving: false,
		shelling: {
			level: null,
			type: null,
		},
		slots: [],
		specialAmmo: null,
		violations: {},
	};

	public componentDidMount(): void {
		const allowedAttributes = [
			AttributeName.AFFINITY,
			AttributeName.DEFENSE,
		];

		const id = this.props.match.params.weapon;

		if (id === 'new') {
			const state: Partial<IState> = {
				allowedAttributes,
				loading: false,
			};

			if (isDurabilityFunctionalityType(this.props.match.params.weaponType)) {
				state.durability = (new Array(6) as Durability[]).fill({
					blue: 0,
					green: 0,
					orange: 0,
					red: 0,
					white: 0,
					yellow: 0,
				});
			}

			if (isAmmoFunctionalityType(this.props.match.params.weaponType)) {
				state.ammo = Object.values(AmmoType).map((type: AmmoType) => ({
					capacities: (new Array(ammoLevels[type])).fill(0),
					type,
				} as AmmoCapacity));
			}

			if (isDeviationFunctionalityType(this.props.match.params.weaponType))
				state.deviation = Deviation.NONE;

			this.setState(state as IState);

			return;
		}

		WeaponModel.read(id).then(response => {
			const weapon = response.data;
			const state: Partial<IState> = {};

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

			if (hasAmmoFunctionality(weapon))
				state.ammo = weapon.ammo.sort((a, b) => a.type > b.type ? 1 : (a.type < b.type ? -1 : 0));

			if (hasDeviationFunctionality(weapon))
				state.deviation = weapon.deviation;

			if (hasSpecialAmmoFunctionality(weapon))
				state.specialAmmo = weapon.specialAmmo;

			if (weapon.type === WeaponType.INSECT_GLAIVE)
				state.boostType = weapon.boostType;

			if (weapon.type === WeaponType.GUNLANCE)
				state.shelling = weapon.shelling;

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
				...state as IState,
				allowedAttributes,
				attack: weapon.attack.display.toString(10),
				attributes,
				crafting: weapon.crafting,
				damageType: weapon.damageType,
				elderseal: weapon.elderseal,
				elements: weapon.elements,
				loading: false,
				name: weapon.name || '',
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
							label="Damage Type"
							labelFor="damageType"
							violations={this.state.violations}
						>
							<Select
								disabled={readOnly}
								filterable={false}
								items={Object.values(DamageType)}
								itemTextRenderer={ucfirst}
								onItemSelect={this.onDamageTypeSelect}
								popoverProps={{
									targetClassName: 'full-width',
								}}
								selected={this.state.damageType}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={4}>
						<ValidationAwareFormGroup
							label="Elderseal"
							labelFor="elderseal"
							violations={this.state.violations}
						>
							<ClearableSelect
								filterable={false}
								items={Object.values(Elderseal)}
								itemTextRenderer={ucfirst}
								onClear={this.onEldersealClear}
								onItemSelect={this.onEldersealSelect}
								popoverProps={{
									targetClassName: 'full-width',
								}}
								readOnly={readOnly}
								selected={this.state.elderseal}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					{isPhialFunctionalityType(type) && (
						<Cell size={4}>
							<PhialInfoComponent
								damage={this.state.phial.damage ? this.state.phial.damage.toString(10) : null}
								onChange={this.onPhialInfoChange}
								readOnly={readOnly}
								type={this.state.phial.type}
							/>
						</Cell>
					)}

					{isDeviationFunctionalityType(type) && (
						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Deviation"
								labelFor="deviation"
								violations={this.state.violations}
							>
								<Select
									disabled={readOnly}
									itemListPredicate={filterStrings}
									items={Object.values(Deviation)}
									itemTextRenderer={ucfirst}
									onItemSelect={this.onDeviationSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.deviation}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					)}

					{isSpecialAmmoFunctionalityType(type) && (
						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Special Ammo"
								labelFor="specialAmmo"
								violations={this.state.violations}
							>
								<ClearableSelect
									itemListPredicate={filterStrings}
									items={
										type === WeaponType.LIGHT_BOWGUN ?
											Object.values(LightBowgunSpecialAmmo) :
											Object.values(HeavyBowgunSpecialAmmo)
									}
									itemTextRenderer={ucfirst}
									onClear={this.onSpecialAmmoClear}
									onItemSelect={this.onSpecialAmmoSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									readOnly={readOnly}
									selected={this.state.specialAmmo}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					)}

					{type === WeaponType.INSECT_GLAIVE && (
						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Boost Type"
								labelFor="boostType"
								violations={this.state.violations}
							>
								<Select
									disabled={readOnly}
									itemListPredicate={filterStrings}
									items={Object.values(InsectGlaiveBoostType)}
									itemTextRenderer={ucfirst}
									onItemSelect={this.onBoostTypeSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.boostType}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					)}

					{type === WeaponType.GUNLANCE && (
						<Cell size={4}>
							<ShellingInfo
								onChange={this.onShellingChange}
								readOnly={readOnly}
								shelling={this.state.shelling}
								violations={this.state.violations}
							/>
						</Cell>
					)}

					{isBowCoatingFunctionalityType(type) && (
						<Cell size={4}>
							<ValidationAwareFormGroup
								label="Coatings"
								labelFor="coatings"
								violations={this.state.violations}
							>
								<MultiSelect
									disabled={readOnly}
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

				{isAmmoFunctionalityType(type) && (
					<div style={{marginBottom: 10}}>
						<H3>Ammo Capacities</H3>

						<AmmoCapacityEditor ammo={this.state.ammo} onChange={this.onAmmoChange} readOnly={readOnly} />
					</div>
				)}

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

	private onAmmoChange = (ammo: AmmoCapacity[]) => this.setState({
		ammo: ammo.sort((a, b) => a.type > b.type ? 1 : (a.type < b.type ? -1 : 0)),
	});

	private onAttackChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		attack: cleanNumberString(event.currentTarget.value, false),
	});

	private onAttributesChange = (attributes: IAttribute[]) => this.setState({
		attributes,
	});

	private onBoostTypeSelect = (boostType: InsectGlaiveBoostType) => this.setState({
		boostType,
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

	private onDamageTypeSelect = (damageType: DamageType) => this.setState({
		damageType,
	});

	private onDeviationSelect = (deviation: Deviation) => this.setState({
		deviation,
	});

	private onEldersealClear = () => this.setState({
		elderseal: null,
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

	private onShellingChange = (type: ShellingType, level: number) => this.setState({
		shelling: {
			level,
			type,
		},
	});

	private onSlotsChange = (slots: Slot[]) => this.setState({
		slots,
	});

	private onSpecialAmmoClear = () => this.setState({
		specialAmmo: null,
	});

	private onSpecialAmmoSelect = (specialAmmo: LightBowgunSpecialAmmo | HeavyBowgunSpecialAmmo) => this.setState({
		specialAmmo,
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
				collector[attribute.key as string] = attribute.value;

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
			damageType: this.state.damageType,
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

		if (isAmmoFunctionalityType(payload.type))
			payload.ammo = this.state.ammo;

		if (isDeviationFunctionalityType(payload.type))
			payload.deviation = this.state.deviation;

		if (isSpecialAmmoFunctionalityType(payload.type))
			payload.specialAmmo = this.state.specialAmmo;

		if (payload.type === WeaponType.INSECT_GLAIVE)
			payload.boostType = this.state.boostType;

		if (payload.type === WeaponType.GUNLANCE)
			payload.shelling = this.state.shelling;

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

			if (isValidationFailedError(error)) {
				this.setState({
					violations: error.context.failures,
				});
			}
		});
	};
}

export const WeaponEditor = withRouter(WeaponEditorComponent);
