import {Button} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Durability} from '../../../Api/Models/Weapon';
import {AllDurabilityDialog} from './AllDurabilityDialog';
import {DurabilityBar} from './DurabilityBar';
import {DurabilityDialog} from './DurabilityDialog';
import './DurabilityEditor.scss';

interface IProps {
	durability: Durability[];

	readOnly?: boolean;
}

interface IState {
	activeIndex: number;
	showAllDurabilityDialog: boolean;
}

export class DurabilityEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeIndex: null,
		showAllDurabilityDialog: false,
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
						<Button icon="flow-branch" onClick={this.onEditAllClick}>
							Set All
						</Button>

						<DurabilityDialog
							durability={this.state.activeIndex !== null ? this.props.durability[this.state.activeIndex] : null}
							isOpen={this.state.activeIndex !== null}
							onSave={this.onEditDialogSave}
							onClose={this.onEditDialogClose}
							title={`Handicraft +${this.state.activeIndex}`}
						/>

						<AllDurabilityDialog
							isOpen={this.state.showAllDurabilityDialog}
							onClose={this.onEditAllDialogClose}
							onSave={this.onEditAllDialogSave}
						/>
					</>
				)}
			</>
		);
	}

	private onEditAllClick = () => this.setState({
		showAllDurabilityDialog: true,
	});

	private onEditAllDialogClose = () => this.setState({
		showAllDurabilityDialog: false,
	});

	private onEditAllDialogSave = (durability: Durability[]) => {
		for (let i = 0; i < durability.length; i++)
			this.props.durability[i] = durability[i];

		this.onEditAllDialogClose();
	};

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
