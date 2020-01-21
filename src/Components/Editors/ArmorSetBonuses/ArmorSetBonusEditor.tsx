import {H2, H3, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IValidationFailures, isValidationFailedError} from '../../../Api/Error';
import {ArmorSetBonusModel, ArmorSetBonusRank} from '../../../Api/Models/ArmorSetBonus';
import {Skill, SkillModel} from '../../../Api/Models/Skill';
import {toaster} from '../../../toaster';
import {Role} from '../../RequireRole';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {EditorButtons} from '../EditorButtons';
import {skillSorter} from '../Skills/SkillList';
import {ArmorSetBonusRanksEditor} from './ArmorSetBonusRanksEditor';

interface IRouteProps {
	armorSetBonus: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	loading: boolean;
	name: string;
	ranks: ArmorSetBonusRank[];
	ranksLoading: boolean;
	redirect: boolean;
	saving: boolean;
	skills: Skill[];
	violations: IValidationFailures;
}

class ArmorSetBonusEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		loading: true,
		name: '',
		ranks: [],
		ranksLoading: true,
		redirect: false,
		saving: false,
		skills: null,
		violations: {},
	};

	public componentDidMount(): void {
		const skillsPromise = SkillModel.list(null, {
			id: true,
			name: true,
			'ranks.level': true,
			'ranks.skill': true,
			'ranks.skillName': true,
		}).then(response => {
			const skills = response.data.sort(skillSorter);

			this.setState({
				skills,
			});

			return skills;
		});

		const idParam = this.props.match.params.armorSetBonus;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			skillsPromise.then(() => this.setState({
				ranksLoading: false,
			}));

			return;
		}

		ArmorSetBonusModel.read(idParam).then(response => {
			const bonus = response.data;

			this.setState({
				loading: false,
				name: bonus.name,
			});

			skillsPromise.then(skills => {
				for (const skill of skills) {
					for (const rank of bonus.ranks) {
						if (rank.skill.skill !== skill.id)
							continue;

						const skillRank = skill.ranks.find(item => item.level === rank.skill.level);

						if (!skillRank)
							continue;

						rank.skill = skillRank;
					}
				}

				this.setState({
					ranks: bonus.ranks,
					ranksLoading: false,
				});
			});
		});
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/objects/armor-sets/bonuses" />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<>
				<H2>{this.state.name || 'No Name'}</H2>

				<form onSubmit={this.save}>
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
					</Row>

					<H3>Ranks</H3>

					<ArmorSetBonusRanksEditor
						loading={this.state.ranksLoading}
						onChange={this.onRanksChange}
						ranks={this.state.ranks}
						readOnly={readOnly}
						skills={this.state.skills}
					/>

					<EditorButtons
						onClose={this.onClose}
						onSave={this.save}
						readOnly={readOnly}
						saving={this.state.saving}
					/>
				</form>
			</>
		);
	}

	private onClose = () => this.setState({
		redirect: true,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRanksChange = (ranks: ArmorSetBonusRank[]) => this.setState({
		ranks,
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
			name: this.state.name,
			ranks: this.state.ranks.map(rank => ({
				pieces: rank.pieces,
				skill: {
					level: rank.skill.level,
					skill: rank.skill.skill,
				},
			})),
		};

		const idParam = this.props.match.params.armorSetBonus;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = ArmorSetBonusModel.create(payload, {id: true});
		else
			promise = ArmorSetBonusModel.update(idParam, payload, {id: true});

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} ${idParam === 'new' ? 'created' : 'updated'}.`,
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

export const ArmorSetBonusEditor = withRouter(ArmorSetBonusEditorComponent);
