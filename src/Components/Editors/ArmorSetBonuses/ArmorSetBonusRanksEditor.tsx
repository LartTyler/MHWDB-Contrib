import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {ArmorSetBonusRank} from '../../../Api/Models/ArmorSetBonus';
import {Skill} from '../../../Api/Models/Skill';
import {range} from '../../../Utility/array';
import {compareFields} from '../../../Utility/object';
import {createEntityListFilter} from '../../../Utility/select';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

const filterSkills = createEntityListFilter<Skill>('name');

interface IProps {
	loading: boolean;
	onChange: (ranks: ArmorSetBonusRank[]) => void;
	ranks: ArmorSetBonusRank[];
	skills: Skill[];

	readOnly?: boolean;
}

interface IState {
	activeRank: ArmorSetBonusRank;
	allowedPieces: number[];
	pieces: number;
	showDialog: boolean;
	skill: Skill;
	skillLevel: number;
}

export class ArmorSetBonusRanksEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeRank: null,
		allowedPieces: null,
		pieces: 1,
		showDialog: false,
		skill: null,
		skillLevel: 1,
	};

	public render(): React.ReactNode {
		return (
			<>
				<Table
					columns={[
						{
							render: rank => `${rank.pieces} Piece${rank.pieces !== 1 ? 's' : ''}`,
							title: 'Pieces Required',
						},
						{
							render: rank => `${rank.skill.skillName || 'No Name Provided'} ${rank.skill.level}`,
							title: 'Skill',
						},
						{
							align: 'right',
							render: rank => !this.props.readOnly && (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onEditClick(rank)} />

									<Button icon="cross" minimal={true} onClick={() => this.onDeleteClick(rank)} />
								</>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.ranks}
					fullWidth={true}
					loading={this.props.loading}
					noDataPlaceholder={<div>This armor set bonus has no ranks. Add some using the button below.</div>}
					rowKey="pieces"
				/>

				{!this.props.readOnly && (
					<>
						<Button
							disabled={this.props.loading || this.props.ranks.length === 5}
							icon="plus"
							onClick={this.onAddClick}
							style={{marginTop: 10}}
						>
							Add Rank
						</Button>

						<ThemeContext.Consumer>
							{theme => (
								<Dialog
									className={theme === Theme.DARK ? Classes.DARK : ''}
									enforceFocus={false}
									isOpen={this.state.showDialog}
									onClose={this.onDialogClose}
									title="Modify Rank"
								>
									<div className={Classes.DIALOG_BODY}>
										<FormGroup label="Pieces">
											<Select
												filterable={false}
												items={this.state.allowedPieces}
												onItemSelect={this.onPiecesSelect}
												popoverProps={{
													targetClassName: 'full-width',
												}}
												selected={this.state.pieces}
											/>
										</FormGroup>

										<FormGroup label="Skill">
											<Select
												itemListPredicate={filterSkills}
												items={this.props.skills}
												itemTextRenderer={this.renderSkillText}
												onItemSelect={this.onSkillSelect}
												popoverProps={{
													targetClassName: 'full-width',
												}}
												selected={this.state.skill}
												virtual={true}
											/>
										</FormGroup>

										<FormGroup label="Skill Level">
											<Select
												disabled={this.state.skill === null}
												filterable={false}
												items={this.state.skill ? range(1, this.state.skill.ranks.length) : []}
												itemTextRenderer={this.renderSkillLevelText}
												onItemSelect={this.onSkillLevelSelect}
												popoverProps={{
													targetClassName: 'full-width',
												}}
												selected={this.state.skillLevel}
											/>
										</FormGroup>
									</div>

									<div className={Classes.DIALOG_FOOTER}>
										<div className={Classes.DIALOG_FOOTER_ACTIONS}>
											<Button onClick={this.onDialogClose}>
												Cancel
											</Button>

											<Button intent={Intent.PRIMARY} onClick={this.onDialogSave}>
												Save
											</Button>
										</div>
									</div>
								</Dialog>
							)}
						</ThemeContext.Consumer>
					</>
				)}
			</>
		);
	}

	private renderSkillText = (skill: Skill) => skill.name || 'No Name Provided';

	private renderSkillLevelText = (level: number) => `Level ${level}`;

	private onAddClick = () => {
		const allowedPieces = this.getAllowedPieces();

		this.setState({
			allowedPieces,
			pieces: allowedPieces[0],
			showDialog: true,
		});
	};

	private onDeleteClick = (target: ArmorSetBonusRank) => {
		this.props.onChange(this.props.ranks.filter(rank => rank !== target));
	};

	private onDialogClose = () => this.setState({
		activeRank: null,
		allowedPieces: null,
		pieces: 1,
		showDialog: false,
		skill: null,
		skillLevel: 1,
	});

	private onDialogSave = () => {
		const rank = this.state.activeRank || {};

		rank.pieces = this.state.pieces;
		rank.skill = this.state.skill.ranks.find(skillRank => skillRank.level === this.state.skillLevel);

		if (this.state.activeRank)
			this.props.onChange([...this.props.ranks]);
		else {
			this.props.onChange([...this.props.ranks, rank].sort((a, b) => {
				return compareFields<ArmorSetBonusRank>('pieces', a, b);
			}));
		}

		this.onDialogClose();
	};

	private onEditClick = (rank: ArmorSetBonusRank) => {
		const allowedPieces = this.getAllowedPieces(rank);

		this.setState({
			activeRank: rank,
			allowedPieces,
			pieces: rank.pieces,
			showDialog: true,
			skill: this.props.skills.find(skill => skill.id === rank.skill.skill),
			skillLevel: rank.skill.level,
		});
	};

	private onPiecesSelect = (pieces: number) => this.setState({
		pieces,
	});

	private onSkillSelect = (skill: Skill) => this.setState({
		skill,
		skillLevel: 1,
	});

	private onSkillLevelSelect = (skillLevel: number) => this.setState({
		skillLevel,
	});

	private getAllowedPieces = (current?: ArmorSetBonusRank) => {
		const allowedPieces: number[] = [];

		for (let i = 1; i <= 5; i++) {
			let skip = false;

			for (const rank of this.props.ranks) {
				if (current && current === rank)
					continue;

				if (i === rank.pieces) {
					skip = true;

					break;
				}
			}

			if (skip)
				continue;

			allowedPieces.push(i);
		}

		return allowedPieces;
	};
}
