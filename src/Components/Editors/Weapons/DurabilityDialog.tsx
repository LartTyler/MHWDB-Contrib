import {Button, Classes, Dialog, FormGroup, H4, Intent, Slider} from '@blueprintjs/core';
import * as React from 'react';
import {Durability} from '../../../Api/Models/Weapon';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	durability: Durability;
	isOpen: boolean;
	onSave: (durability: Durability) => void;
	onClose: () => void;
	title: string;

	saveButtonText?: string;
}

interface IState {
	blue: number;
	green: number;
	orange: number;
	red: number;
	sum: number;
	white: number;
	yellow: number;
}

export class DurabilityDialog extends React.PureComponent<IProps, IState> {
	public static defaultProps: Partial<IProps> = {
		saveButtonText: 'save',
	};

	public state: Readonly<IState> = {
		blue: 0,
		green: 0,
		orange: 0,
		red: 0,
		sum: 0,
		white: 0,
		yellow: 0,
	};

	public componentDidMount(): void {
		this.setStateFromDurability(this.props.durability);
	}

	public componentDidUpdate(prevProps: Readonly<IProps>): void {
		if (prevProps.durability === this.props.durability)
			return;

		this.setStateFromDurability(this.props.durability);
	}

	public render(): React.ReactNode {
		return (
			<ThemeContext.Consumer>
				{theme => (
					<Dialog
						className={theme === Theme.DARK ? Classes.DARK : ''}
						isOpen={this.props.isOpen}
						onClose={this.props.onClose}
						title={this.props.title}
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

							{this.props.children}
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button onClick={this.props.onClose}>
									Cancel
								</Button>

								<Button intent={Intent.PRIMARY} onClick={this.onSave}>
									{this.props.saveButtonText}
								</Button>
							</div>
						</div>
					</Dialog>
				)}
			</ThemeContext.Consumer>
		);
	}

	private onSave = () => {
		this.props.onSave({
			blue: this.state.blue,
			green: this.state.green,
			orange: this.state.orange,
			red: this.state.red,
			white: this.state.white,
			yellow: this.state.yellow,
		});
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

	private setStateFromDurability = (durability: Durability) => {
		if (typeof durability === 'undefined' || durability === null) {
			this.setState({
				blue: 0,
				green: 0,
				orange: 0,
				red: 0,
				sum: 0,
				white: 0,
				yellow: 0,
			});

			return;
		}

		this.setState({
			...durability,
			sum: Object.values(durability).reduce((prev, value) => prev + value, 0),
		} as unknown as IState);
	};
}
