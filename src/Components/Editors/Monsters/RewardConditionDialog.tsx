import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {RewardCondition, RewardConditionType} from '../../../Api/Models/Reward';
import {ucwords} from '../../../Utility/string';
import {Theme, ThemeContext} from '../../Contexts/ThemeContext';

interface IProps {
	condition: RewardCondition;
	isOpen: boolean;
	onClose: () => void;
	onSave: () => void;
}

interface IState {
	type: RewardConditionType;
}

export class RewardConditionDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		type: null,
	};

	public render(): React.ReactNode {
		return (
			<ThemeContext.Consumer>
				{theme => (
					<Dialog
						className={theme === Theme.DARK ? Classes.DARK : ''}
						isOpen={this.props.isOpen}
						onClose={this.props.onClose}
						title="Add Reward Condition"
					>
						<div className={Classes.DIALOG_BODY}>
							<form onSubmit={this.onSave}>
								<FormGroup label="Type" labelFor="type">
									<Select
										filterable={false}
										items={Object.values(RewardConditionType)}
										itemTextRenderer={ucwords}
										onItemSelect={this.onTypeSelect}
										popoverProps={{
											targetClassName: 'full-width',
										}}
									/>
								</FormGroup>
							</form>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button onClick={this.props.onClose}>
									Cancel
								</Button>

								<Button intent={Intent.PRIMARY} onClick={this.onSave}>
									Save
								</Button>
							</div>
						</div>
					</Dialog>
				)}
			</ThemeContext.Consumer>
		);
	}

	private onTypeSelect = (type: RewardConditionType) => this.setState({
		type,
	});

	private onSave = (event: React.SyntheticEvent<any>) => {
		event.preventDefault();
	};
}
