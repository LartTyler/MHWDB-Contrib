import {Button, Classes, Dialog, FormGroup, Intent, Slider, H4} from '@blueprintjs/core';
import {Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Durability} from '../../../Api/Models/Weapon';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';
import {DurabilityBar} from './DurabilityBar';
import './DurabilityEditor.scss';

interface IProps {
	durability: Durability[];

	readOnly?: boolean;
}

interface IState {
	activeIndex: number;
	blue: number;
	green: number;
	orange: number;
	red: number;
	sum: number;
	white: number;
	yellow: number;
}

export class DurabilityEditor extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		activeIndex: null,
		blue: 0,
		green: 0,
		orange: 0,
		red: 0,
		sum: 0,
		white: 0,
		yellow: 0,
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
									onClick={() => this.onEditClick(index, durability)}
								/>
							),
							title: <span>&nbsp;</span>,
						},
					]}
					dataSource={this.props.durability}
					fullWidth={true}
				/>

				{!this.props.readOnly && (
					<ThemeContext.Consumer>
						{theme => (
							<Dialog
								className={theme === Theme.DARK ? Classes.DARK : ''}
								isOpen={this.state.activeIndex !== null}
								onClose={this.onEditDialogClose}
								title={`Editing Handicraft +${this.state.activeIndex}`}
							>
								<div className={Classes.DIALOG_BODY}>
									<H4>{400 - this.state.sum} durability remaining.</H4>

									<FormGroup label="Red Sharpness">
										<Slider
											className="sharpness-red-slider"
											showTrackFill={false}
											labelStepSize={50}
											min={0}
											max={250}
											onChange={this.onSharpnessRedChange}
											stepSize={5}
											value={this.state.red}
										/>
									</FormGroup>

									<FormGroup label="Orange Sharpness">
										<Slider
											className="sharpness-orange-slider"
											disabled={this.state.red === 0}
											labelStepSize={50}
											min={0}
											max={250}
											onChange={this.onSharpnessOrangeChange}
											stepSize={5}
											value={this.state.orange}
										/>
									</FormGroup>

									<FormGroup label="Yellow Sharpness">
										<Slider
											className="sharpness-yellow-slider"
											disabled={this.state.orange === 0}
											labelStepSize={50}
											min={0}
											max={250}
											onChange={this.onSharpnessYellowChange}
											stepSize={5}
											value={this.state.yellow}
										/>
									</FormGroup>

									<FormGroup label="Green Sharpness">
										<Slider
											className="sharpness-green-slider"
											disabled={this.state.yellow === 0}
											labelStepSize={50}
											min={0}
											max={250}
											onChange={this.onSharpnessGreenChange}
											stepSize={5}
											value={this.state.green}
										/>
									</FormGroup>

									<FormGroup label="Blue Sharpness">
										<Slider
											className="sharpness-blue-slider"
											disabled={this.state.green === 0}
											labelStepSize={50}
											min={0}
											max={250}
											onChange={this.onSharpnessBlueChange}
											stepSize={5}
											value={this.state.blue}
										/>
									</FormGroup>

									<FormGroup label="White Sharpness">
										<Slider
											className="sharpness-white-slider"
											disabled={this.state.blue === 0}
											labelStepSize={50}
											min={0}
											max={250}
											onChange={this.onSharpnessWhiteChange}
											stepSize={5}
											value={this.state.white}
										/>
									</FormGroup>
								</div>

								<div className={Classes.DIALOG_FOOTER}>
									<div className={Classes.DIALOG_FOOTER_ACTIONS}>
										<Button onClick={this.onEditDialogClose}>
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
				)}
			</>
		);
	}

	private onEditClick = (index: number, durability: Durability) => this.setState({
		activeIndex: index,
		blue: durability.blue,
		green: durability.green,
		orange: durability.orange,
		red: durability.red,
		sum: Object.values(durability).reduce((prev, value) => prev + value, 0),
		white: durability.white,
		yellow: durability.yellow,
	});

	private onEditDialogClose = () => this.setState({
		activeIndex: null,
		blue: 0,
		green: 0,
		orange: 0,
		red: 0,
		sum: 0,
		white: 0,
		yellow: 0,
	});

	private onEditDialogSave = () => {
		this.props.durability[this.state.activeIndex] = {
			blue: this.state.blue,
			green: this.state.green,
			orange: this.state.orange,
			red: this.state.red,
			white: this.state.white,
			yellow: this.state.yellow,
		};

		this.onEditDialogClose();
	};

	private onSharpnessBlueChange = (value: number) => this.onSharpnessChange('blue', value);

	private onSharpnessGreenChange = (value: number) => this.onSharpnessChange('green', value);

	private onSharpnessOrangeChange = (value: number) => this.onSharpnessChange('orange', value);

	private onSharpnessRedChange = (value: number) => this.onSharpnessChange('red', value);

	private onSharpnessYellowChange = (value: number) => this.onSharpnessChange('yellow', value);

	private onSharpnessWhiteChange = (value: number) => this.onSharpnessChange('white', value);

	private onSharpnessChange = (color: keyof Durability, value: number) => {
		if (this.state.sum === 400 && this.state[color] <= value)
			return;

		const sum = this.state.sum - this.state[color];
		value = Math.min(value, 400 - sum);

		this.setState({
			[color]: value,
			sum: sum + value,
		} as unknown as IState);
	};
}
