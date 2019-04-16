import {H2, H3, Icon} from '@blueprintjs/core';
import {Cell, Row, Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Platform, PlatformExclusivity, WorldEvent, WorldEventModel, WorldEventType} from '../../Api/Models/WorldEvent';

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
	events: WorldEvent[];
	loading: boolean;
	platform: Platform | 'all';
}

export class WorldEvents extends React.PureComponent<{}, IState> {
	public state: Readonly<IState> = {
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
							render: event => {
								const date = event.startTimestamp;

								return `${date.toLocaleDateString()} ${date.toLocaleTimeString().replace(':00 ', ' ')}`;
							},
							title: 'Start Date',
						},
						{
							render: event => {
								const date = event.endTimestamp;

								return `${date.toLocaleDateString()} ${date.toLocaleTimeString().replace(':00 ', ' ')}`;
							},
							title: 'End Date',
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

	private onPlatformSelect = (platform: Platform | 'all') => this.setState({
		platform,
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
