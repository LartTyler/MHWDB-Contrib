import {Button, Classes, Menu, MenuDivider, MenuItem, Popover, Tooltip} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {CharmRank} from '../../../Api/Models/Charm';
import {Skill, SkillModel, SkillRank} from '../../../Api/Models/Skill';
import {SkillDialog} from '../SkillDialog';
import {skillSorter} from '../Skills/SkillList';

export type RankUpdateSubject = 'crafting' | 'skills';

interface IProps {
	baseCharmName: string;
	onAdd: (rank: CharmRank) => void;
	onDelete: (target: CharmRank) => void;
	onUpdate: (target: CharmRank, subject: RankUpdateSubject) => void;
	ranks: CharmRank[];
}

interface IState {
	activeComponent: RankUpdateSubject;
	activeRank: CharmRank;
	skills: Skill[];
}

export class CharmRanksTable extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeComponent: null,
		activeRank: null,
		skills: [],
	};

	public componentDidMount(): void {
		SkillModel.list().then(response => this.setState({
			skills: response.data.sort(skillSorter),
		}));
	}

	public render(): React.ReactNode {
		return (
			<>
				<Table
					columns={[
						{
							dataIndex: 'name',
							title: 'Name',
						},
						{
							align: 'center',
							dataIndex: 'level',
							title: 'Level',
						},
						{
							align: 'center',
							render: rank => (
								<Popover>
									<Tooltip content="Edit skills..." hoverOpenDelay={1000}>
										<Button minimal={true}>
											{rank.skills.length} Skill{rank.skills.length !== 1 ? 's' : ''}
										</Button>
									</Tooltip>

									<Menu>
										<MenuItem
											icon="plus"
											text="Add Skill"
											onClick={() => this.onAddSkillsClick(rank)}
										/>

										<MenuDivider />

										{rank.skills.length > 0 && rank.skills.map(skill => (
											<MenuItem
												icon="book"
												key={skill.id}
												labelElement={(
													<Button
														className={Classes.POPOVER_DISMISS_OVERRIDE}
														icon="cross"
														minimal={true}
														onClick={() => this.onSkillDelete(rank, skill)}
														small={true}
													/>
												)}
												text={`${skill.skillName} ${skill.level}`}
											/>
										)) || (
											<MenuItem disabled={true} text="No skills yet" />
										)}
									</Menu>
								</Popover>
							),
							title: 'Skills',
						},
						{
							align: 'right',
							render: rank => (
								<>
									<Tooltip content="Edit crafting..." hoverOpenDelay={1000}>
										<Button
											icon="build"
											minimal={true}
											onClick={() => this.onEditCraftingClick(rank)}
										/>
									</Tooltip>

									<Button icon="cross" minimal={true} onClick={() => this.props.onDelete(rank)} />
								</>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.ranks}
					fullWidth={true}
					noDataPlaceholder={<div>This charm has no ranks yet.</div>}
					rowKey="level"
				/>

				<Button icon="plus" style={{marginTop: 10}} onClick={this.onAddClick}>
					Add Rank
				</Button>

				{this.state.activeComponent === 'skills' && (
					<SkillDialog
						isOpen={true}
						onClose={this.discard}
						onSave={this.onSkillAdd}
						skills={this.state.skills}
					/>
				)}
			</>
		);
	}

	private onAddClick = () => this.props.onAdd({
		crafting: {
			craftable: this.props.ranks.length === 0,
			materials: [],
		},
		level: this.props.ranks.length + 1,
		name: `${this.props.baseCharmName} ${this.props.ranks.length + 1}`,
		rarity: 0,
		skills: [],
	});

	private onAddSkillsClick = (rank: CharmRank) => this.setState({
		activeComponent: 'skills',
		activeRank: rank,
	});

	private onEditCraftingClick = (rank: CharmRank) => this.setState({
		activeComponent: 'crafting',
		activeRank: rank,
	});

	private onSkillAdd = (rank: SkillRank) => {
		this.state.activeRank.skills.push(rank);

		this.save();
	};

	private onSkillDelete = (rank: CharmRank, target: SkillRank) => {
		rank.skills = rank.skills.filter(skill => skill !== target);

		this.props.onUpdate(rank, 'skills');
	};

	private save = () => {
		this.props.onUpdate(this.state.activeRank, this.state.activeComponent);

		this.setState({
			activeComponent: null,
			activeRank: null,
		});
	};

	private discard = () => this.setState({
		activeComponent: null,
		activeRank: null,
	});
}
