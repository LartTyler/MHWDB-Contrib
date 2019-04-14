import {Button, ButtonGroup, Classes, H2, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, MultiSelect, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IConstraintViolations, isConstraintViolationError} from '../../../Api/Error';
import {Rank} from '../../../Api/Model';
import {Armor, ArmorModel} from '../../../Api/Models/Armor';
import {ArmorSetModel} from '../../../Api/Models/ArmorSet';
import {ArmorSetBonus, ArmorSetBonusModel} from '../../../Api/Models/ArmorSetBonus';
import {toaster} from '../../../toaster';
import {createEntityListFilter} from '../../../Utility/select';
import {ucfirst} from '../../../Utility/string';
import {Role} from '../../RequireRole';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {armorSorter} from '../Armor/ArmorList';
import {armorSetBonusSorter} from '../ArmorSetBonuses/ArmorSetBonusList';
import {EditorButtons} from '../EditorButtons';
import './ArmorSetEditor.scss';

const filterArmorList = createEntityListFilter<Armor>('name');
const filterBonusList = createEntityListFilter<ArmorSetBonus>('name');

interface IRouteProps {
	armorSet: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	armor: Armor[];
	bonus: ArmorSetBonus;
	bonuses: ArmorSetBonus[];
	loading: boolean;
	name: string;
	pieces: Armor[];
	rank: Rank;
	redirect: boolean;
	saving: boolean;
	violations: IConstraintViolations;
}

class ArmorSetEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		armor: null,
		bonus: null,
		bonuses: null,
		loading: true,
		name: '',
		pieces: [],
		rank: null,
		redirect: false,
		saving: false,
		violations: {},
	};

	public componentDidMount(): void {
		const armorPromise = ArmorModel.list(null, {
			id: true,
			name: true,
		}).then(response => {
			const armor = response.data.sort(armorSorter);

			this.setState({
				armor,
			});

			return armor;
		});

		const bonusesPromise = ArmorSetBonusModel.list(null, {
			id: true,
			name: true,
		}).then(response => {
			const bonuses = response.data.sort(armorSetBonusSorter);

			this.setState({
				bonuses,
			});

			return bonuses;
		});

		const idParam = this.props.match.params.armorSet;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		ArmorSetModel.read(idParam).then(response => {
			const set = response.data;

			this.setState({
				loading: false,
				name: set.name,
				rank: set.rank,
			});

			armorPromise.then(armor => {
				const pieceIds = set.pieces.map(piece => piece.id);

				this.setState({
					pieces: armor.filter(piece => pieceIds.indexOf(piece.id) !== -1),
				});
			});

			if (set.bonus) {
				bonusesPromise.then(bonuses => {
					this.setState({
						bonus: bonuses.find(bonus => bonus.id === set.bonus.id) || null,
					});
				});
			}
		});
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/objects/armor-sets" />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.save}>
					<Row>
						<Cell size={7}>
							<ValidationAwareFormGroup label="Name" labelFor="name" violations={this.state.violations}>
								<InputGroup
									name="name"
									onChange={this.onNameChange}
									readOnly={readOnly}
									value={this.state.name}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={5}>
							<ValidationAwareFormGroup label="Rank" labelFor="rank" violations={this.state.violations}>
								<Select
									disabled={readOnly}
									filterable={false}
									items={[
										Rank.LOW,
										Rank.HIGH,
									]}
									itemTextRenderer={this.renderRankText}
									onItemSelect={this.onRankSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.rank}
								/>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={7}>
							<ValidationAwareFormGroup
								label="Pieces"
								labelFor="pieces"
								violations={this.state.violations}
							>
								<MultiSelect
									disabled={readOnly}
									itemListPredicate={filterArmorList}
									items={this.state.armor}
									itemTextRenderer={this.renderArmorText}
									loading={this.state.armor === null}
									onClear={this.onArmorClear}
									onItemDeselect={this.onArmorDeselect}
									onItemSelect={this.onArmorSelect}
									popoverProps={{
										popoverClassName: 'armor-set-pieces-popover',
										targetClassName: 'full-width',
									}}
									selected={this.state.pieces}
									virtual={true}
								/>
							</ValidationAwareFormGroup>
						</Cell>

						<Cell size={5}>
							<ValidationAwareFormGroup label="Bonus" labelFor="Bonus" violations={this.state.violations}>
								<ButtonGroup fill={true}>
									<Select
										disabled={readOnly}
										itemListPredicate={filterBonusList}
										items={this.state.bonuses}
										itemTextRenderer={this.renderBonusText}
										loading={this.state.bonuses === null}
										onItemSelect={this.onBonusSelect}
										popoverProps={{
											className: 'full-width',
											targetClassName: 'full-width',
										}}
										selected={this.state.bonus}
										virtual={true}
									/>

									{!readOnly && this.state.bonuses !== null && (
										<Button className={Classes.FIXED} icon="cross" onClick={this.onBonusClear} />
									)}
								</ButtonGroup>
							</ValidationAwareFormGroup>
						</Cell>
					</Row>

					<EditorButtons
						onClose={this.onCancelClick}
						onSave={this.save}
						readOnly={readOnly}
						saving={this.state.saving}
					/>
				</form>
			</>
		);
	}

	private renderArmorText = (armor: Armor) => armor.name;

	private renderBonusText = (bonus: ArmorSetBonus) => bonus.name;

	private renderRankText = (rank: Rank) => ucfirst(rank);

	private onArmorClear = () => this.setState({
		pieces: [],
	});

	private onArmorDeselect = (target: Armor) => this.setState({
		pieces: this.state.pieces.filter(armor => armor !== target),
	});

	private onArmorSelect = (armor: Armor) => this.setState({
		pieces: [...this.state.pieces, armor],
	});

	private onBonusClear = () => this.setState({
		bonus: null,
	});

	private onBonusSelect = (bonus: ArmorSetBonus) => this.setState({
		bonus,
	});

	private onCancelClick = () => this.setState({
		redirect: true,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRankSelect = (rank: Rank) => this.setState({
		rank,
	});

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const payload = {
			bonus: this.state.bonus ? this.state.bonus.id : null,
			name: this.state.name,
			pieces: this.state.pieces.map(piece => piece.id),
			rank: this.state.rank,
		};

		const idParam = this.props.match.params.armorSet;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = ArmorSetModel.create(payload, {id: true});
		else
			promise = ArmorSetModel.update(idParam, payload, {id: true});

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

export const ArmorSetEditor = withRouter(ArmorSetEditorComponent);
