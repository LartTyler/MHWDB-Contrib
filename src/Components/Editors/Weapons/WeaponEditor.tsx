import {H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {IConstraintViolations} from '../../../Api/Error';
import {Slot} from '../../../Api/Model';
import {AttributeName, IAttribute} from '../../../Api/Models/attributes';
import {
	Durability,
	WeaponCrafting,
	WeaponElement,
	WeaponModel,
	WeaponType,
	weaponTypeLabels,
} from '../../../Api/Models/Weapon';
import {cleanNumberString} from '../../../Utility/number';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {AttributesEditor} from '../Attributes/AttributesEditor';
import {Slots} from '../Slots';
import {DurabilityEditor} from './DurabilityEditor';
import {ElementEditor} from './ElementEditor';
import {WeaponCraftingEditor} from './WeaponCraftingEditor';

interface IRouteProps {
	weaponType: WeaponType;
	weapon: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	allowedAttributes: AttributeName[];
	attributes: IAttribute[];
	crafting: WeaponCrafting;
	durability: Durability[];
	elements: WeaponElement[];
	loading: boolean;
	name: string;
	rarity: string;
	redirect: boolean;
	saving: boolean;
	slots: Slot[];
	violations: IConstraintViolations;
}

class WeaponEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		allowedAttributes: [],
		attributes: [],
		crafting: {
			branches: [],
			craftable: false,
			craftingMaterials: [],
			previous: null,
			upgradeMaterials: [],
		},
		durability: [],
		elements: [],
		loading: true,
		name: '',
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
			AttributeName.ELDERSEAL,
		];

		switch (this.props.match.params.weaponType) {
			case WeaponType.BOW:
				allowedAttributes.push(
					AttributeName.COATINGS,
				);

				break;

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

			case WeaponType.CHARGE_BLADE:
			case WeaponType.SWITCH_AXE:
				allowedAttributes.push(AttributeName.PHIAL_TYPE);

				break;
		}

		const id = this.props.match.params.weapon;

		if (id === 'new') {
			this.setState({
				allowedAttributes,
				loading: false,
			});

			if (WeaponModel.isRanged(this.props.match.params.weaponType)) {
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

			if (!WeaponModel.isRanged(weapon.type)) {
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

				this.setState({
					durability,
				});
			}

			this.setState({
				allowedAttributes,
				attributes: Object.entries(weapon.attributes).map(([attribute, value]) => ({
					key: attribute as AttributeName,
					value,
				})),
				crafting: weapon.crafting,
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
			return <Redirect to={`/edit/weapons/${type}`} />;

		return (
			<form onSubmit={this.save}>
				<H2>{weaponTypeLabels[type]}: {this.state.name || 'No Name'}</H2>

				<Row>
					<Cell size={8}>
						<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
							<InputGroup name="name" onChange={this.onNameChange} value={this.state.name} />
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={4}>
						<ValidationAwareFormGroup label="Rarity" labelFor="rarity" violations={this.state.violations}>
							<InputGroup name="rarity" onChange={this.onRarityChange} value={this.state.rarity} />
						</ValidationAwareFormGroup>
					</Cell>
				</Row>

				<Row>
					<Cell size={8}>
						<H3>Attributes</H3>

						<AttributesEditor
							accepted={this.state.allowedAttributes}
							attributes={this.state.attributes}
							onChange={this.onAttributesChange}
						/>
					</Cell>

					<Cell size={4}>
						<H3>Slots</H3>

						<Slots slots={this.state.slots} onChange={this.onSlotsChange} />
					</Cell>
				</Row>

				<H3 style={{marginTop: 15}}>Crafting</H3>

				<WeaponCraftingEditor
					crafting={this.state.crafting}
					weaponId={this.props.match.params.weapon}
					weaponType={type}
				/>

				<Row>
					{!WeaponModel.isRanged(type) && (
						<Cell size={6}>
							<H3 style={{marginTop: 15}}>Durability</H3>

							<DurabilityEditor durability={this.state.durability} />
						</Cell>
					)}

					<Cell size={WeaponModel.isRanged(type) ? 12 : 6}>
						<H3 style={{marginTop: 15}}>Elements</H3>

						<ElementEditor
							elements={this.state.elements}
							onElementAdd={this.onElementAdd}
							onElementChange={this.onElementChange}
							onElementRemove={this.onElementRemove}
						/>
					</Cell>
				</Row>
			</form>
		);
	}

	private onAttributesChange = (attributes: IAttribute[]) => this.setState({
		attributes,
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
	};
}

export const WeaponEditor = withRouter(WeaponEditorComponent);
