import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Skill, SkillRank} from '../../../Api/Models/Skill';
import {range} from '../../../Utility/array';
import {createEntityListFilter} from '../../../Utility/select';
import {IThemeAware, Theme, withTheme} from '../../Contexts/ThemeContext';
import {EntitySelect} from '../../Select/EntitySelect';

const skillFilter = createEntityListFilter<Skill>('name');

interface IProps extends IThemeAware {
	isOpen: boolean;
	onClose: () => void;
	onSave: (rank: SkillRank, skill: Skill) => void;
	skills: Skill[];

	omit?: Skill[];
}

interface IState {
	level: number;
	levelChoices: number[];
	skill: Skill;
}

const SkillEntitySelect = EntitySelect.ofType<Skill>();

class SkillDialogComponent extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		level: null,
		levelChoices: [],
		skill: null,
	};

	public render(): React.ReactNode {
		return (
			<Dialog
				className={this.props.theme === Theme.DARK ? Classes.DARK : ''}
				isOpen={this.props.isOpen}
				onClose={this.props.onClose}
				title="Select A Skill"
			>
				<div className={Classes.DIALOG_BODY}>
					<FormGroup label="Skill">
						<SkillEntitySelect
							config={{
								itemKey: 'id',
								itemListPredicate: skillFilter,
								items: this.props.skills,
								multi: false,
								omit: this.props.omit,
								onItemSelect: this.onSkillSelect,
								popoverProps: {
									targetClassName: 'full-width',
								},
								selected: this.state.skill,
							}}
							labelField="name"
						/>
					</FormGroup>

					<FormGroup label="Level" labelFor="level">
						<Select
							buttonProps={{
								alignText: 'left',
								disabled: this.state.skill === null,
								fill: true,
								rightIcon: 'caret-down',
							}}
							disabled={this.state.skill === null}
							filterable={false}
							itemTextRenderer={this.renderLevelText}
							items={this.state.levelChoices}
							onItemSelect={this.onLevelSelect}
							popoverProps={{
								targetClassName: 'full-width',
							}}
							selected={this.state.level}
						/>
					</FormGroup>
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={this.props.onClose}>
							Cancel
						</Button>

						<Button
							disabled={!this.state.skill || !this.state.level}
							intent={Intent.PRIMARY}
							onClick={this.save}
						>
							Save
						</Button>
					</div>
				</div>
			</Dialog>
		);
	}

	private renderLevelText = (level: number) => `Level ${level}`;

	private onLevelSelect = (level: number) => this.setState({
		level,
	});

	private onSkillSelect = (skill: Skill) => this.setState({
		level: 1,
		levelChoices: range(1, skill.ranks.length),
		skill,
	});

	private save = () => {
		this.props.onSave(this.state.skill.ranks.find(rank => rank.level === this.state.level), this.state.skill);

		this.setState({
			level: null,
			levelChoices: [],
			skill: null,
		});
	};
}

export const SkillDialog = withTheme(SkillDialogComponent);
