import {Button, Classes, Colors, Dialog, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Camp} from '../../../Api/Models/Location';
import {range} from '../../../Utility/array';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';
import {IValidationFailures} from '../../../Api/Error';
import {lcfirst, ucfirst} from '../../../Utility/string';

interface IProps {
	camps: Camp[];
	onDelete: (target: Camp) => void;
	onSave: (camp: Camp) => void;
	onUpdate: () => void;
	zoneCount: number;

	readOnly?: boolean;
	violations?: IValidationFailures;
}

interface IState {
	activeCampIndex: number;
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
			activeCampIndex: null,
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
		let errorMessage = null;

		if (this.props.violations) {
			const firstKey = Object.keys(this.props.violations).find(key => key.indexOf('camps[') === 0);

			if (firstKey) {
				const error = this.props.violations[firstKey];

				const path = error.path.replace(/\.strings\[\d+\]/, '');
				const message = lcfirst(error.message.substr(0, error.message.length - 1));

				errorMessage =
					`One or more camps did not pass validation: ${message} (at ${path})`;
			}
		}

		return (
			<>
				{errorMessage && (
					<span style={{color: Colors.RED5}}>{errorMessage}</span>
				)}

				<Table
					columns={[
						{
							render: camp => camp.name || '???',
							title: 'Name',
						},
						{
							dataIndex: 'zone',
							title: 'Zone',
						},
						{
							align: 'right',
							render: (camp, index) => !readOnly && (
								<>
									<Button icon="edit" minimal={true} onClick={() => this.onCampEditClick(index)} />

									<Button icon="cross" minimal={true} onClick={() => this.props.onDelete(camp)} />
								</>
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
									enforceFocus={false}
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
												itemListPredicate={this.filterZoneList}
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

	private filterZoneList = (query: string, items: number[]) => {
		return items.filter(item => item.toString(10).indexOf(query) !== -1);
	};

	private onCampEditClick = (activeCampIndex: number) => this.setState({
		activeCampIndex,
		name: this.props.camps[activeCampIndex].name || '',
		showDialog: true,
		zone: this.props.camps[activeCampIndex].zone,
	});

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
		if (this.state.activeCampIndex === null) {
			this.props.onSave({
				name: this.state.name,
				zone: this.state.zone,
			});
		} else {
			this.props.camps[this.state.activeCampIndex].name = this.state.name;
			this.props.camps[this.state.activeCampIndex].zone = this.state.zone;

			this.props.onUpdate();
		}

		this.setState({
			activeCampIndex: null,
			name: '',
			showDialog: false,
			zone: null,
		});
	};

	private getZoneOptions = () => {
		const omitted = this.props.camps.map(camp => camp.zone);

		return range(1, this.props.zoneCount).filter(zone => omitted.indexOf(zone) === -1);
	};
}
