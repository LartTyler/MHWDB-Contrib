import {
	Button,
	Classes,
	Dialog,
	FormGroup,
	InputGroup,
	Intent,
	Menu,
	MenuDivider,
	MenuItem,
	Popover,
	Spinner,
	Tooltip,
} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {CharmRank} from '../../../Api/Models/Charm';
import {CraftingCost, Item, ItemModel} from '../../../Api/Models/Item';
import {Skill, SkillModel, SkillRank} from '../../../Api/Models/Skill';
import {cleanNumberString} from '../../../Utility/number';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';
import {CraftingCostDialog, itemSorter} from '../CraftingCostDialog';
import {SkillDialog} from '../SkillDialog';
import {skillSorter} from '../Skills/SkillList';

export type RankUpdateSubject = 'crafting' | 'info' | 'skills';

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
	activeRankRarity: string;
	items: Item[];
	skills: Skill[];
}

export class CharmRanksTable extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeComponent: null,
		activeRank: null,
		activeRankRarity: '',
		items: [],
		skills: [],
	};

	public componentDidMount(): void {
		SkillModel.list().then(response => this.setState({
			skills: response.data.sort(skillSorter),
		}));

		ItemModel.list().then(response => this.setState({
			items: response.data.sort(itemSorter),
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
							dataIndex: 'rarity',
							title: 'Rarity',
						},
						{
							align: 'center',
							render: this.renderSkillPopover,
							title: 'Skills',
						},
						{
							align: 'center',
							render: this.renderCraftingPopover,
							title: 'Crafting',
						},
						{
							align: 'right',
							render: rank => (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onEditDialogShow(rank)} />
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

				<ThemeContext.Consumer>
					{theme => (
						<Dialog
							className={theme === Theme.DARK ? Classes.DARK : ''}
							isOpen={this.state.activeComponent === 'info'}
							onClose={this.discard}
							title="Edit Rank"
						>
							<div className={Classes.DIALOG_BODY}>
								<FormGroup label="Name" labelFor="name">
									<InputGroup
										name="name"
										readOnly={true}
										value={this.state.activeRank ? this.state.activeRank.name : ''}
									/>
								</FormGroup>

								<FormGroup label="Rarity" labelFor="rarity">
									<InputGroup
										name="rarity"
										onChange={this.onRarityChange}
										value={this.state.activeRankRarity}
									/>
								</FormGroup>
							</div>

							<div className={Classes.DIALOG_FOOTER}>
								<div className={Classes.DIALOG_FOOTER_ACTIONS}>
									<Button onClick={this.discard}>
										Cancel
									</Button>

									<Button intent={Intent.PRIMARY} onClick={this.onEditDialogSave}>
										Save
									</Button>
								</div>
							</div>
						</Dialog>
					)}
				</ThemeContext.Consumer>

				{this.state.activeComponent === 'skills' && (
					<SkillDialog
						isOpen={true}
						onClose={this.discard}
						onSave={this.onSkillAdd}
						skills={this.state.skills}
					/>
				)}

				{this.state.activeComponent === 'crafting' && (
					<CraftingCostDialog
						isOpen={true}
						items={this.state.items}
						onClose={this.discard}
						onSubmit={this.onCraftingCostAdd}
					/>
				)}
			</>
		);
	}

	private renderCraftingPopover = (rank: CharmRank) => {
		const loading = this.state.items.length === 0;

		return (
			<Popover>
				<Tooltip content="Edit crafting..." hoverOpenDelay={1000}>
					<Button minimal={true}>
						{rank.crafting.materials.length} Material{rank.skills.length !== 1 ? 's' : ''}
					</Button>
				</Tooltip>

				<Menu>
					<MenuItem
						disabled={loading}
						icon={loading && (
							<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
						) || 'plus'}
						text="Add Material"
						onClick={() => this.onAddMaterialClick(rank)}
					/>

					<MenuDivider />

					{rank.crafting.materials.length > 0 && rank.crafting.materials.map(cost => (
						<MenuItem
							icon="graph"
							key={cost.item.id}
							labelElement={(
								<Button
									className={Classes.POPOVER_DISMISS_OVERRIDE}
									icon="cross"
									minimal={true}
									onClick={() => this.onCraftingCostDelete(rank, cost)}
									small={true}
								/>
							)}
							text={`${cost.quantity}x ${cost.item.name}`}
						/>
					)) || (
						<MenuItem disabled={true} text="No materials yet" />
					)}
				</Menu>
			</Popover>
		);
	};

	private renderSkillPopover = (rank: CharmRank) => {
		const loading = this.state.skills.length === 0;

		return (
			<Popover>
				<Tooltip content="Edit skills..." hoverOpenDelay={1000}>
					<Button minimal={true}>
						{rank.skills.length} Skill{rank.skills.length !== 1 ? 's' : ''}
					</Button>
				</Tooltip>

				<Menu>
					<MenuItem
						disabled={loading}
						icon={loading && (
							<Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
						) || 'plus'}
						text="Add Skill"
						onClick={() => this.onAddSkillClick(rank)}
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
		);
	};

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

	private onAddMaterialClick = (rank: CharmRank) => this.setState({
		activeComponent: 'crafting',
		activeRank: rank,
	});

	private onAddSkillClick = (rank: CharmRank) => this.setState({
		activeComponent: 'skills',
		activeRank: rank,
	});

	private onCraftingCostAdd = (cost: CraftingCost) => {
		this.state.activeRank.crafting.materials.push(cost);

		this.save();
	};

	private onCraftingCostDelete = (rank: CharmRank, target: CraftingCost) => {
		rank.crafting.materials = rank.crafting.materials.filter(cost => cost !== target);

		this.props.onUpdate(rank, 'crafting');
	};

	private onEditDialogSave = () => {
		this.state.activeRank.rarity = parseInt(this.state.activeRankRarity, 10);

		this.save();
	};

	private onEditDialogShow = (rank: CharmRank) => this.setState({
		activeComponent: 'info',
		activeRank: rank,
		activeRankRarity: rank.rarity.toString(10),
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		activeRankRarity: cleanNumberString(event.currentTarget.value, false),
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
		activeRankRarity: null,
	});
}
