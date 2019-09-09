import {Button, FormGroup, H2, H3, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import {Cell, Row, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {isRoleGrantedToUser} from '../../../Api/client';
import {SkillModel, SkillPayload, SkillRank} from '../../../Api/Models/Skill';
import {Projection} from '../../../Api/routes';
import {toaster} from '../../../toaster';
import {Role} from '../../RequireRole';
import {EditorButtons} from '../EditorButtons';
import {RankEditDialog} from './RankEditDialog';

interface IRouteProps {
	skill: string;
}

interface ISkillEditorProps extends RouteComponentProps<IRouteProps> {
}

interface ISkillEditorState {
	activeRank: SkillRank;
	description: string;
	loading: boolean;
	name: string;
	ranks: SkillRank[];
	redirect: boolean;
	saving: boolean;
	showRankEditDialog: boolean;
}

class SkillEditorComponent extends React.PureComponent<ISkillEditorProps, ISkillEditorState> {
	public state: Readonly<ISkillEditorState> = {
		activeRank: null,
		description: '',
		loading: true,
		name: '',
		ranks: [],
		redirect: false,
		saving: false,
		showRankEditDialog: false,
	};

	public componentDidMount(): void {
		const idParam = this.props.match.params.skill;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		SkillModel.read(idParam).then(response => {
			const skill = response.data;

			this.setState({
				description: skill.description,
				loading: false,
				name: skill.name,
				ranks: skill.ranks,
			});
		});
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/objects/skills" />;

		const readOnly = !isRoleGrantedToUser(Role.EDITOR);

		return (
			<>
				<H2>{this.state.name.length ? this.state.name : 'No Name'}</H2>

				<form onSubmit={this.onSave}>
					<Row>
						<Cell size={6}>
							<FormGroup label="Name" labelFor="name">
								<InputGroup
									name="name"
									onChange={this.onNameChange}
									readOnly={readOnly}
									value={this.state.name}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<FormGroup label="Description" labelFor="description">
						<TextArea
							fill={true}
							name="description"
							onChange={this.onDescriptionChange}
							readOnly={readOnly}
							value={this.state.description}
						/>
					</FormGroup>

					<H3>Ranks</H3>

					<Table
						dataSource={this.state.ranks}
						columns={[
							{
								render: rank => `Level ${rank.level}`,
								title: 'Rank',
							},
							{
								dataIndex: 'description',
								title: 'Description',
							},
							{
								render: rank => {
									const length = Object.keys(rank.modifiers).length;

									return `${length} Modifier${length !== 1 ? 's' : ''}`;
								},
								title: 'Modifiers',
							},
							{
								align: 'right',
								render: (rank, index) => (
									<>
										<Button
											icon={readOnly ? 'eye-open' : 'edit'}
											minimal={true}
											onClick={() => this.onRankEditClick(index)}
										/>

										{!readOnly && (
											<Button
												icon="cross"
												minimal={true}
												onClick={() => this.onRankDeleteClick(index)}
											/>
										)}
									</>
								),
								title: '',
							},
						]}
						fullWidth={true}
						noDataPlaceholder={<div>This skill has no ranks.</div>}
						rowKey="level"
					/>

					{!readOnly && (
						<Button icon="plus" onClick={this.onAddRankButtonClick} style={{marginTop: 10}}>
							Add Rank
						</Button>
					)}

					<EditorButtons
						onClose={this.onClose}
						onSave={this.onSave}
						readOnly={readOnly}
						saving={this.state.saving}
					/>
				</form>

				{this.state.showRankEditDialog && (
					<RankEditDialog
						isOpen={this.state.showRankEditDialog}
						onClose={this.onRankDialogClose}
						onCreate={this.onRankDialogCreateRank}
						onSave={this.onRankDialogSaveRank}
						rank={this.state.activeRank}
						readOnly={readOnly}
					/>
				)}
			</>
		);
	}

	private onAddRankButtonClick = () => this.setState({
		activeRank: null,
		showRankEditDialog: true,
	});

	private onClose = () => this.setState({
		redirect: true,
	});

	private onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRankDeleteClick = (targetIndex: number) => {
		const ranks = [...this.state.ranks];

		ranks.splice(targetIndex, 1);

		for (let i = targetIndex, ii = ranks.length; i < ii; i++)
			ranks[i].level -= 1;

		this.setState({
			ranks,
		});
	};

	private onRankDialogClose = () => this.setState({
		activeRank: null,
		showRankEditDialog: false,
	});

	private onRankDialogCreateRank = (rank: SkillRank) => {
		this.onRankDialogClose();

		rank.level = this.state.ranks.length + 1;

		this.setState({
			ranks: [...this.state.ranks, rank],
		});
	};

	private onRankDialogSaveRank = () => {
		this.onRankDialogClose();

		this.setState({
			ranks: [...this.state.ranks],
		});
	};

	private onRankEditClick = (index: number) => this.setState({
		activeRank: this.state.ranks[index],
		showRankEditDialog: true,
	});

	private onSave = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const payload: SkillPayload = {
			description: this.state.description,
			name: this.state.name,
			ranks: this.state.ranks,
		};

		const projection: Projection = {
			name: true,
		};

		const idParam = this.props.match.params.skill;
		let promise: Promise<unknown>;

		if (idParam === 'new')
			promise = SkillModel.create(payload, projection);
		else
			promise = SkillModel.update(parseInt(idParam, 10), payload, projection);

		promise.then(() => {
			toaster.show({
				intent: Intent.SUCCESS,
				message: `${this.state.name} ${idParam === 'new' ? 'created' : 'saved'} successfully.`,
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
		});
	};
}

export const SkillEditor = withRouter(SkillEditorComponent);
