import {H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps} from 'react-router';
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

const weaponAttributes = [
	AttributeName.AFFINITY,
	AttributeName.AMMO_CAPACITIES,
	AttributeName.COATINGS,
	AttributeName.DEFENSE,
	AttributeName.DEVIATION,
	AttributeName.ELDERSEAL,
	AttributeName.GL_SHELLING_TYPE,
	AttributeName.IG_BOOST_TYPE,
	AttributeName.PHIAL_TYPE,
	AttributeName.SPECIAL_AMMO,
];

interface IRouteProps {
	weaponType: WeaponType;
	weapon: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
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

class WeaponEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
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
		const id = this.props.match.params.weapon;

		if (id === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		WeaponModel.read(id).then(response => {
			const weapon = response.data;

			this.setState({
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
					accepted={weaponAttributes}
					attributes={this.state.attributes}
					onChange={this.onAttributesChange}
				/>
			</form>
		);
	}

	private onAttributesChange = (attributes: IAttribute[]) => this.setState({
		attributes,
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
