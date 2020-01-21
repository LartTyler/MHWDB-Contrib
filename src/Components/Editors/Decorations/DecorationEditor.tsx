import {Button, H2, InputGroup, Intent, Spinner} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {IValidationFailures, isValidationFailedError} from '../../../Api/Error';
import {DecorationModel} from '../../../Api/Models/Decoration';
import {Skill, SkillModel, SkillRank} from '../../../Api/Models/Skill';
import {toaster} from '../../../toaster';
import {cleanNumberString} from '../../../Utility/number';
import {Role} from '../../RequireRole';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';
import {EditorButtons} from '../EditorButtons';
import {createEntitySorter} from '../EntityList';
import {SkillDialog} from '../SkillDialog';
import {slotRanks} from '../Slots';

const skillSorter = createEntitySorter<Skill>('name');

interface IRouteProps {
	decoration: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {
}

interface IState {
	loading: boolean;
	name: string;
	omittedSkills: Skill[];
	rarity: string;
	redirect: boolean;
	saving: boolean;
	showSkillDialog: boolean;
	skillList: Skill[];
	skills: SkillRank[];
	slot: number;
	violations: IValidationFailures;
}

class DecorationEditorComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		loading: true,
		name: '',
		omittedSkills: [],
		rarity: '',
		redirect: false,
		saving: false,
		showSkillDialog: false,
		skillList: null,
		skills: [],
		slot: 1,
		violations: {},
	};

	public componentDidMount(): void {
		const skillsPromise = SkillModel.list().then(response => {
			const skillList = response.data.sort(skillSorter);

			this.setState({
				skillList,
			});

			return skillList;
		});

		const idParam = this.props.match.params.decoration;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		DecorationModel.read(idParam).then(response => {
			const deco = response.data;

			this.setState({
				loading: false,
				name: deco.name,
				rarity: deco.rarity.toString(10),
				slot: deco.slot,
			});

			skillsPromise.then(skillList => {
				const skills: SkillRank[] = [];
				const omittedSkills: Skill[] = [];

				for (const rank of deco.skills) {
					const matched = skillList.find(skill => skill.id === rank.skill);

					if (!matched)
						continue;

					const matchedRank = matched.ranks.find(item => item.level === rank.level);

					if (matchedRank) {
						skills.push(matchedRank);
						omittedSkills.push(matched);
					}
				}

				this.setState({
					omittedSkills,
					skills,
				});
			});
		});
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/objects/decorations" />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<form onSubmit={this.save}>
				<H2>{this.state.name || 'No Name'}</H2>

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

				<Row>
					<Cell size={6}>
						<ValidationAwareFormGroup label="Rarity" labelFor="rarity" violations={this.state.violations}>
							<InputGroup
								name="rarity"
								onChange={this.onRarityChange}
								readOnly={readOnly}
								value={this.state.rarity}
							/>
						</ValidationAwareFormGroup>
					</Cell>

					<Cell size={6}>
						<ValidationAwareFormGroup label="Slot" labelFor="slot" violations={this.state.violations}>
							<Select
								disabled={readOnly}
								items={slotRanks}
								onItemSelect={this.onSlotSelect}
								popoverProps={{
									targetClassName: 'full-width',
								}}
								selected={this.state.slot}
							/>
						</ValidationAwareFormGroup>
					</Cell>
				</Row>

				<H2>Skills</H2>

				<Table
					dataSource={this.state.skills}
					columns={[
						{
							dataIndex: 'skillName',
							title: 'Name',
						},
						{
							dataIndex: 'level',
							style: {
								width: 100,
							},
							title: 'Level',
						},
						{
							align: 'right',
							render: record => !readOnly && (
								<Button icon="cross" minimal={true} onClick={() => this.onSkillRemove(record)} />
							),
							title: <div>&nbsp;</div>,
						},
					]}
					fullWidth={true}
					loading={this.state.skillList === null}
					noDataPlaceholder={<div>This decoration has no skills.</div>}
					rowKey="id"
				/>

				{!readOnly && (
					<>
						<Button icon="plus" onClick={this.onSkillDialogShow} style={{marginTop: 10}}>
							Add Skill
						</Button>

						<SkillDialog
							isOpen={this.state.showSkillDialog}
							omit={this.state.omittedSkills}
							onClose={this.onSkillDialogClose}
							onSave={this.onSkillAdd}
							skills={this.state.skillList}
						/>
					</>
				)}

				<EditorButtons
					onClose={this.onClose}
					onSave={this.save}
					readOnly={readOnly}
					saving={this.state.saving}
				/>
			</form>
		);
	}

	private onClose = () => this.setState({
		redirect: true,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanNumberString(event.currentTarget.value, false),
	});

	private onSkillAdd = (rank: SkillRank, skill: Skill) => this.setState({
		omittedSkills: [...this.state.omittedSkills, skill],
		showSkillDialog: false,
		skills: [...this.state.skills, rank],
	});

	private onSkillDialogClose = () => this.setState({
		showSkillDialog: false,
	});

	private onSkillDialogShow = () => this.setState({
		showSkillDialog: true,
	});

	private onSkillRemove = (target: SkillRank) => this.setState({
		omittedSkills: this.state.omittedSkills.filter(skill => skill.id !== target.skill),
		skills: this.state.skills.filter(rank => rank !== target),
	});

	private onSlotSelect = (slot: number) => this.setState({
		slot,
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
			rarity: parseInt(this.state.rarity, 10),
			skills: this.state.skills.map(rank => ({
				level: rank.level,
				skill: rank.skill,
			})),
			slot: this.state.slot,
		};

		const idParam = this.props.match.params.decoration;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = DecorationModel.create(payload);
		else
			promise = DecorationModel.update(idParam, payload);

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

export const DecorationEditor = withRouter(DecorationEditorComponent);
