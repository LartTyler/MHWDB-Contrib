import {Button} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Durability} from '../../../Api/Models/Weapon';
import {DurabilityBar} from './DurabilityBar';
import {DurabilityDialog} from './DurabilityDialog';
import './DurabilityEditor.scss';

interface IProps {
	durability: Durability[];

	readOnly?: boolean;
}

interface IState {
	activeIndex: number;
}

export class DurabilityEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeIndex: null,
	};

	public render(): React.ReactNode {
		return (
			<>
				<Table
					columns={[
						{
							render: (durability, index) => `Handicraft +${index}`,
							style: {
								width: 150,
							},
							title: 'Level',
						},
						{
							render: durability => <DurabilityBar durability={durability} />,
							style: {
								width: 200,
							},
							title: 'Values',
						},
						{
							align: 'right',
							render: (durability, index) => !this.props.readOnly && (
								<Button
									icon="edit"
									minimal={true}
									onClick={() => this.onEditClick(index)}
								/>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.durability}
					fullWidth={true}
				/>

				{!this.props.readOnly && (
					<>
						<Button icon="flow-branch">
							Set All
						</Button>

						<DurabilityDialog
							durability={this.state.activeIndex !== null ? this.props.durability[this.state.activeIndex] : null}
							isOpen={this.state.activeIndex !== null}
							onSave={this.onEditDialogSave}
							onClose={this.onEditDialogClose}
							title={`Handicraft +${this.state.activeIndex}`}
						/>
					</>
				)}
			</>
		);
	}

	private onEditClick = (index: number) => this.setState({
		activeIndex: index,
	});

	private onEditDialogClose = () => this.setState({
		activeIndex: null,
	});

	private onEditDialogSave = (durability: Durability) => {
		this.props.durability[this.state.activeIndex] = durability;

		this.onEditDialogClose();
	};
}
