import {Button, FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import {Cell, Row, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {ISkill, ISkillRank} from '../../../Api/Objects/Skill';
import {Projection} from '../../../Api/Projection';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {LinkButton} from '../../Navigation/LinkButton';
import {RankEditDialog} from './RankEditDialog';

interface IRouteProps {
	skill: string;
}

interface ISkillEditorProps extends IApiClientAware, IToasterAware, RouteComponentProps<IRouteProps> {
}

interface ISkillEditorState {
	activeRank: ISkillRank;
	description: string;
	loading: boolean;
	name: string;
	ranks: ISkillRank[];
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

		this.props.client.skills.get(parseInt(idParam, 10)).then(skill => this.setState({
			description: skill.description,
			loading: false,
			name: skill.name,
			ranks: skill.ranks,
		}));
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/skills" />;

		return (
			<>
				<H2>{this.state.name.length ? this.state.name : 'Unnamed'}</H2>

				<form onSubmit={this.onSave}>
					<Row>
						<Cell size={6}>
							<FormGroup label="Name" labelFor="name">
								<InputGroup name="name" onChange={this.onNameChange} value={this.state.name} />
							</FormGroup>
						</Cell>
					</Row>

					<FormGroup label="Description" labelFor="description">
						<TextArea
							fill={true}
							name="description"
							onChange={this.onDescriptionChange}
							value={this.state.description}
						/>
					</FormGroup>

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
											icon="edit"
											minimal={true}
											onClick={() => this.onRankEditClick(index)}
										/>

										<Button
											icon="cross"
											minimal={true}
											onClick={() => this.onRankDeleteClick(index)}
										/>
									</>
								),
								title: '',
							},
						]}
						fullWidth={true}
						noDataPlaceholder={(
							<div style={{marginBottom: 5}}>
								This skill has no ranks yet. Add some using the button below.
							</div>
						)}
						rowKey="id"
					/>

					<Row>
						<Cell size={2}>
							<Button icon="plus" onClick={this.onAddRankButtonClick}>
								Add Rank
							</Button>
						</Cell>

						<Cell className="text-right" offset={8} size={2}>
							<LinkButton to="/edit/skills" linkProps={{style: {marginRight: 10}}}>
								Cancel
							</LinkButton>

							<Button intent={Intent.PRIMARY} onClick={this.onSave}>
								Save
							</Button>
						</Cell>
					</Row>
				</form>

				{this.state.showRankEditDialog && (
					<RankEditDialog
						isOpen={this.state.showRankEditDialog}
						onClose={this.onRankDialogClose}
						onCreate={this.onRankDialogCreateRank}
						onSave={this.onRankDialogSaveRank}
						rank={this.state.activeRank}
					/>
				)}
			</>
		);
	}

	private onAddRankButtonClick = () => this.setState({
		activeRank: null,
		showRankEditDialog: true,
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

	private onRankDialogCreateRank = (rank: ISkillRank) => {
		this.onRankDialogClose();

		rank.level = this.state.ranks.length;

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

		const payload: ISkill = {
			description: this.state.description,
			name: this.state.name,
			ranks: this.state.ranks,
		};

		const projection: Projection = {
			name: true,
		};

		const idParam = this.props.match.params.skill;
		let promise: Promise<ISkill>;

		if (idParam === 'new')
			promise = this.props.client.skills.create(payload, projection);
		else
			promise = this.props.client.skills.update(parseInt(idParam, 10), payload, projection);

		promise.then(skill => {
			this.props.toaster.show({
				intent: Intent.SUCCESS,
				message: `${skill.name} ${idParam === 'new' ? 'created' : 'saved'} successfully.`,
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			this.props.toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			this.setState({
				saving: false,
			});
		});
	};
}

export const SkillEditor = withApiClient(withToasterContext(withRouter(SkillEditorComponent)));
