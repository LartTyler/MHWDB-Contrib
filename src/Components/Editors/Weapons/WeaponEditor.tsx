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

			return;
		}

		WeaponModel.read(id).then(response => {
			const weapon = response.data;

			this.setState({
				allowedAttributes,
				attributes: Object.entries(weapon.attributes).map(([attribute, value]) => ({
					key: attribute as AttributeName,
					value,
				})),
				crafting: weapon.crafting,
				durability: weapon.durability,
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
					<Cell size={6}>
						<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
							<InputGroup name="name" onChange={this.onNameChange} value={this.state.name} />
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={6}>
						<ValidationAwareFormGroup label="Rarity" labelFor="rarity" violations={this.state.violations}>
							<InputGroup name="rarity" onChange={this.onRarityChange} value={this.state.rarity} />
						</ValidationAwareFormGroup>
					</Cell>
				</Row>

				<H3>Attributes</H3>

				<AttributesEditor
					accepted={this.state.allowedAttributes}
					attributes={this.state.attributes}
					onChange={this.onAttributesChange}
				/>

				<H3 style={{marginTop: 10}}>Crafting</H3>

				<WeaponCraftingEditor crafting={this.state.crafting} onChange={this.onCraftingChange} />
			</form>
		);
	}

	private onAttributesChange = (attributes: IAttribute[]) => this.setState({
		attributes,
	});

	private onCraftingChange = (crafting: WeaponCrafting) => this.setState({
		crafting: {...crafting},
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanNumberString(event.currentTarget.value, false),
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
