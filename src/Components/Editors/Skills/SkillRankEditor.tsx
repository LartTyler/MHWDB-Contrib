import {H3, TextArea} from '@blueprintjs/core';
import * as React from 'react';
import {ISkillRank, ISkillRankModifiers} from '../../../Api/Objects/Skill';

type SkillRank = Pick<ISkillRank, 'level' | 'description' | 'modifiers'>;

interface ISkillRankEditorProps {
	rank: SkillRank;

	level?: number;
}

interface ISkillRankEditorState {
	level: string;
	description: string;
	modifiers: ISkillRankModifiers;
}

export class SkillRankEditor extends React.PureComponent<ISkillRankEditorProps, ISkillRankEditorState> {
	public constructor(props: ISkillRankEditorProps) {
		super(props);

		this.state = {
			level: (props.level || props.rank.level).toString(),
			description: props.rank.description,
			modifiers: props.rank.modifiers,
		};
	}

	public render(): React.ReactNode {
		return (
			<div style={{marginBottom: 10}}>
				<H3>Level {this.state.level}</H3>

				<TextArea fill={true} onChange={this.onDescriptionChange} value={this.state.description} />
			</div>
		);
	}

	private onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});
}
