import {Button, Classes, Dialog, H4, InputGroup, Intent} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Durability, durabilityOrder} from '../../../Api/Models/Weapon';
import {cleanNumberString} from '../../../Utility/number';
import {ucfirst} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';
import {DurabilityDialog} from './DurabilityDialog';

interface IBreakpoint {
	color: keyof Durability;
	value: string;
}

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (durability: Durability[]) => void;
}

interface IState {
	baseDurability: Durability;
	breakpoints: IBreakpoint[];
	showBreakpointsDialog: boolean;
}

export class AllDurabilityDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		baseDurability: null,
		breakpoints: [],
		showBreakpointsDialog: false,
	};

	public componentDidUpdate(prevProps: Readonly<IProps>): void {
		if (this.props.isOpen === prevProps.isOpen)
			return;

		this.setState({
			showBreakpointsDialog: false,
		});
	}

	public render(): React.ReactNode {
		return (
			<>
				<DurabilityDialog
					durability={null}
					isOpen={this.props.isOpen && !this.state.showBreakpointsDialog}
					onSave={this.onBaseDurabilitySave}
					onClose={this.onClose}
					saveButtonText="Next"
					title="Base Durability (Handicraft +0)"
				/>

				<ThemeContext.Consumer>
					{theme => (
						<Dialog
							className={theme === Theme.DARK ? Classes.DARK : ''}
							isOpen={this.state.showBreakpointsDialog}
							onClose={this.onClose}
							title="Durability Breakpoints"
						>
							<div className={Classes.DIALOG_BODY}>
								<Row>
									<Cell size={5}>
										<H4>Sharpness Color</H4>
									</Cell>

									<Cell size={7}>
										<H4>Value</H4>
									</Cell>
								</Row>

								{this.state.breakpoints.map((breakpoint, index) => {
									let disabled = false;

									if (index > 1) {
										const prev = this.state.breakpoints[index - 1];

										disabled = prev.value === '' || prev.value === '0';
									}

									return (
										<Row key={breakpoint.color} style={{marginBottom: 10}}>
											<Cell size={5}>
												{ucfirst(breakpoint.color)}
											</Cell>

											<Cell size={7}>
												<InputGroup
													disabled={disabled}
													name={`breakpoint-${breakpoint.color}`}
													onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
														this.onBreakpointChange(event, index);
													}}
													value={breakpoint.value}
												/>
											</Cell>
										</Row>
									);
								})}
							</div>

							<div className={Classes.DIALOG_FOOTER}>
								<div className={Classes.DIALOG_FOOTER_ACTIONS}>
									<Button onClick={this.onBackClick}>
										Back
									</Button>

									<Button intent={Intent.PRIMARY} onClick={this.onBreakpointsSave}>
										Save
									</Button>
								</div>
							</div>
						</Dialog>
					)}
				</ThemeContext.Consumer>
			</>
		);
	}

	private onBaseDurabilitySave = (baseDurability: Durability) => {
		const breakpoints: IBreakpoint[] = [];

		for (let i = 0; i < durabilityOrder.length; i++) {
			const color = durabilityOrder[i];

			if (baseDurability[color] !== 0)
				continue;

			if (breakpoints.length === 0 && i > 0) {
				const prevColor = durabilityOrder[i - 1];

				breakpoints.push({
					color: prevColor,
					value: baseDurability[prevColor].toString(10),
				});
			}

			if (color === 'purple')
				break;

			breakpoints.push({
				color,
				value: '',
			});
		}

		if (breakpoints.length === 0) {
			this.onBreakpointsSave();

			return;
		}

		this.setState({
			baseDurability,
			breakpoints,
			showBreakpointsDialog: true,
		});
	};

	private onBackClick = () => this.setState({
		showBreakpointsDialog: false,
	});

	private onBreakpointChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		this.state.breakpoints[index].value = cleanNumberString(event.currentTarget.value, false);

		this.forceUpdate();
	};

	private onBreakpointsSave = () => {
		const current = {...this.state.baseDurability};
		let sum = Object.values(current).reduce((prev, value) => prev + value, 0);

		const durability: Durability[] = [
			{...current},
		];

		const breakpoints = [...this.state.breakpoints];
		let breakpoint = breakpoints.shift();

		for (let i = 0; i < 5; i++) {
			if (sum < 400) {
				if (breakpoint && current[breakpoint.color] >= parseInt(breakpoint.value, 10))
					breakpoint = breakpoints.shift();

				if (!breakpoint)
					current.purple += 10;
				else {
					current[breakpoint.color] += 10;

					if (current[breakpoint.color] >= parseInt(breakpoint.value, 10))
						breakpoint = breakpoints.shift();
				}

				sum += 10;
			}

			durability.push({...current});
		}

		this.props.onSave(durability);
	};

	private onClose = () => {
		this.setState({
			baseDurability: null,
			breakpoints: [],
		});

		this.props.onClose();
	};
}
