import {Button, H4, TextArea} from '@blueprintjs/core';
import * as React from 'react';
import {getDisplayName} from '../../../Api/Objects/attributes';
import {ISkillRank, ISkillRankModifiers} from '../../../Api/Objects/Skill';
import {Cell, Row} from '../../Grid';

type SkillRank = Pick<ISkillRank, 'level' | 'description' | 'modifiers'>;

interface ISkillRankEditorProps {
	onDelete: (rank: SkillRank) => void;
	rank: SkillRank;
}

interface ISkillRankEditorState {
	description: string;
	modifiers: ISkillRankModifiers;
}

export class SkillRankEditor extends React.PureComponent<ISkillRankEditorProps, ISkillRankEditorState> {
	public constructor(props: ISkillRankEditorProps) {
		super(props);

		this.state = {
			description: props.rank.description,
			modifiers: props.rank.modifiers,
		};
	}

	public render(): React.ReactNode {
		return (
			<div style={{marginBottom: 10}}>
				<Row>
					<Cell size={6}>
						<H4>Level {this.props.rank.level}</H4>
					</Cell>

					<Cell size={1} offset={5} className="text-right">
						<Button icon="cross" minimal={true} onClick={this.onDeleteClick} />
					</Cell>
				</Row>

				<TextArea fill={true} onChange={this.onDescriptionChange} value={this.state.description} />

				{this.renderModifiers()}
			</div>
		);
	}

	private renderModifiers(): React.ReactNode {
		const modifiers = Object.keys(this.state.modifiers).map((key) => (
			<Cell key={key} size={4}>
				{getDisplayName(key)}
			</Cell>
		));

		return (
			<Row>
				{modifiers}
			</Row>
		);
	}

	private onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onDeleteClick = () => this.props.onDelete(this.props.rank);
}
