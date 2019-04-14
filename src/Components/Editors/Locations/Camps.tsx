import {Button, Classes, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Camp} from '../../../Api/Models/Location';
import {range} from '../../../Utility/array';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	camps: Camp[];
	onDelete: (target: Camp) => void;
	onSave: (camp: Camp) => void;
	zoneCount: number;

	readOnly?: boolean;
}

interface IState {
	name: string;
	showDialog: boolean;
	zone: number;
	zones: number[];
}

export class Camps extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		const zones = this.getZoneOptions();

		this.state = {
			name: '',
			showDialog: false,
			zone: zones[0] || null,
			zones,
		};
	}

	public componentDidUpdate(prevProps: Readonly<IProps>): void {
		if (prevProps.camps === this.props.camps && prevProps.zoneCount === this.props.zoneCount)
			return;

		const zones = this.getZoneOptions();

		this.setState({
			zones,
		});

		if (!this.state.zone) {
			this.setState({
				zone: zones[0] || null,
			});
		}
	}

	public render(): React.ReactNode {
		const readOnly = this.props.readOnly;

		return (
			<>
				<Table
					columns={[
						{
							dataIndex: 'name',
							title: 'Name',
						},
						{
							dataIndex: 'zone',
							title: 'Zone',
						},
						{
							align: 'right',
							render: camp => !readOnly && (
								<Button icon="cross" minimal={true} onClick={() => this.props.onDelete(camp)} />
							),
							title: <>&nbsp;</>,
						},
					]}
					dataSource={this.props.camps}
					fullWidth={true}
					noDataPlaceholder={(
						<div style={{marginBottom: 10}}>
							This location has no camps yet.
						</div>
					)}
					rowKey="zone"
				/>

				{!readOnly && (
					<>
						<Button disabled={!this.props.zoneCount} icon="plus" onClick={this.onDialogShow}>
							Add Camp
						</Button>

						<ThemeContext.Consumer>
							{theme => (
								<Dialog
									className={theme === Theme.DARK ? Classes.DARK : ''}
									isOpen={this.state.showDialog}
									onClose={this.onDialogClose}
									title="Add Camp"
								>
									<div className={Classes.DIALOG_BODY}>
										<FormGroup label="Name">
											<InputGroup
												name="campName"
												onChange={this.onNameChange}
												value={this.state.name}
											/>
										</FormGroup>

										<FormGroup label="Zone">
											<Select
												items={this.state.zones}
												onItemSelect={this.onZoneSelect}
												popoverProps={{
													targetClassName: 'full-width',
												}}
												selected={this.state.zone}
											/>
										</FormGroup>
									</div>

									<div className={Classes.DIALOG_FOOTER}>
										<div className={Classes.DIALOG_FOOTER_ACTIONS}>
											<Button onClick={this.onDialogClose}>
												Cancel
											</Button>

											<Button
												disabled={!this.state.name || !this.state.zone}
												intent={Intent.PRIMARY}
												onClick={this.onSave}
											>
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

	private onDialogClose = () => this.setState({
		showDialog: false,
	});

	private onDialogShow = () => this.setState({
		showDialog: true,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onZoneSelect = (zone: number) => this.setState({
		zone,
	});

	private onSave = () => {
		this.setState({
			name: '',
			showDialog: false,
			zone: null,
		});

		this.props.onSave({
			name: this.state.name,
			zone: this.state.zone,
		});
	};

	private getZoneOptions = () => {
		const omitted = this.props.camps.map(camp => camp.zone);

		return range(1, this.props.zoneCount).filter(zone => omitted.indexOf(zone) === -1);
	};
}
