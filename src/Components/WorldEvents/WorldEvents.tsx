import {Button, Classes, Dialog, H2, H3, Icon} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Platform, PlatformExclusivity, WorldEvent, WorldEventModel, WorldEventType} from '../../Api/Models/WorldEvent';
import {formatDateTime} from '../../Utility/date';
import {Theme, ThemeContext} from '../Contexts/ThemeContext';

const eventTypeNames: { [key in WorldEventType]: string } = {
	[WorldEventType.KULVE_TAROTH]: 'Kulve Taroth Seige',
	[WorldEventType.EVENT_QUEST]: 'Event Quests',
	[WorldEventType.CHALLENGE_QUEST]: 'Challenge Quests',
};

const platformNames: { [key in Platform]: string } = {
	[Platform.CONSOLE]: 'Console',
	[Platform.PC]: 'PC',
};

const platformExclusivityNames: { [key in PlatformExclusivity]: string } = {
	[PlatformExclusivity.PS4]: 'PS4',
};

interface IState {
	activeEvent: WorldEvent;
	events: WorldEvent[];
	loading: boolean;
	platform: Platform | 'all';
}

export class WorldEvents extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
		activeEvent: null,
		events: [],
		loading: false,
		platform: 'all',
	};

	public componentDidMount(): void {
		this.load();
	}

	public render(): React.ReactNode {
		return (
			<div className="content-container">
				<H2>Events</H2>

				<Row>
					<Cell size={2}>
						<Select
							filterable={false}
							items={['all', ...Object.values(Platform)]}
							itemTextRenderer={this.renderPlatformText}
							onItemSelect={this.onPlatformSelect}
							popoverProps={{
								targetClassName: 'full-width',
							}}
							selected={this.state.platform}
						/>
					</Cell>
				</Row>

				{Object.values(WorldEventType).map(type => {
					return this.renderSection(type, this.state.events.filter(event => {
						if (event.type !== type)
							return false;
						else if (this.state.platform !== 'all' && event.platform !== this.state.platform)
							return false;

						return true;
					}));
				})}

				<ThemeContext.Consumer>
					{theme => {
						const event = this.state.activeEvent;

						if (!event)
							return null;

						return (
							<Dialog
								className={theme === Theme.DARK ? Classes.DARK : ''}
								isOpen={event !== null}
								onClose={this.onDialogClose}
								title="Event Details"
							>
								<div className={`${Classes.DIALOG_BODY}`}>
									<H3>Event Dates</H3>

									<p>
										{formatDateTime(event.startTimestamp)} ~ {formatDateTime(event.endTimestamp)}
									</p>

									<H3 style={{marginTop: 10}}>Location</H3>

									<p>
										{event.location.name}
									</p>

									{event.requirements !== null && (
										<>
											<H3 style={{marginTop: 10}}>Requirements</H3>

											<p>
												{event.requirements}
											</p>
										</>
									)}

									{event.successConditions !== null && (
										<>
											<H3 style={{marginTop: 10}}>Success Conditions</H3>

											<p>
												{event.successConditions}
											</p>
										</>
									)}

									<H3 style={{marginTop: 10}}>Description</H3>

									<p className={Classes.RUNNING_TEXT}>
										{event.description}
									</p>
								</div>

								<div className={Classes.DIALOG_FOOTER}>
									<div className={Classes.DIALOG_FOOTER_ACTIONS}>
										<Button onClick={this.onDialogClose}>
											Close
										</Button>
									</div>
								</div>
							</Dialog>
						);
					}}
				</ThemeContext.Consumer>
			</div>
		);
	}

	private renderSection = (type: WorldEventType, events: WorldEvent[]): React.ReactNode => {
		return (
			<div key={type}>
				<H3 style={{marginTop: 10}}>{eventTypeNames[type]}</H3>

				<Table
					columns={[
						{
							dataIndex: 'name',
							style: {
								width: 400,
							},
							title: 'Name',
						},
						{
							render: event => {
								let output = platformNames[event.platform];

								if (event.exclusive)
									output += ` (${platformExclusivityNames[event.exclusive]} only)`;

								return output;
							},
							style: {
								width: 200,
							},
							title: 'Platform',
						},
						{
							render: event => (
								<>
									{event.questRank} <Icon icon="star" />
								</>
							),
							title: 'Rank',
						},
						{
							render: event => formatDateTime(event.startTimestamp),
							title: 'Start Date',
						},
						{
							render: event => formatDateTime(event.endTimestamp),
							title: 'End Date',
						},
						{
							render: event => (
								<Button icon="eye-open" minimal={true} onClick={() => this.onShowInfoClick(event)} />
							),
							title: '',
						},
					]}
					dataSource={events}
					fullWidth={true}
					loading={this.state.loading}
					noDataPlaceholder="There are no events in this category."
				/>
			</div>
		);
	};

	private renderPlatformText = (platform: string) => {
		return platform === 'all' ? 'All Platforms' : platformNames[platform as Platform];
	};

	private onDialogClose = () => this.setState({
		activeEvent: null,
	});

	private onPlatformSelect = (platform: Platform | 'all') => this.setState({
		platform,
	});

	private onShowInfoClick = (event: WorldEvent) => this.setState({
		activeEvent: event,
	});

	private load = () => {
		if (this.state.loading)
			return;

		this.setState({
			loading: true,
		});

		WorldEventModel.list().then(response => {
			const events = response.data.sort((a, b) => {
				if (a.startTimestamp > b.startTimestamp)
					return 1;
				else if (a.startTimestamp < b.startTimestamp)
					return -1;

				return 0;
			});

			this.setState({
				events,
				loading: false,
			});
		});
	};
}
