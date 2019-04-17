import * as React from 'react';
import {Durability} from '../../../Api/Models/Weapon';
import {DurabilityDialog} from './DurabilityDialog';

interface IBreakpoint {
	color: keyof Durability;
	value: number;
}

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (durability: Durability[]) => void;
}

interface IState {
	breakpoints: IBreakpoint[];
}

export class AllDurabilityDialog extends React.PureComponent<IProps, IState> {
	public state: Readonly<IState> = {
		breakpoints: [],
	};

	public render(): React.ReactNode {
		return (
			<DurabilityDialog
				durability={null}
				isOpen={this.props.isOpen}
				onSave={this.onSave}
				onClose={this.props.onClose}
				title="Set All Durability Levels"
			/>
		);
	}

	private onSave = (current: Durability) => {
		const durability: Durability[] = [
			{...current},
		];

		for (let i = 0; i < 5; i++) {
			const keys = Object.keys(current) as Array<keyof Durability>;
			let key: keyof Durability = keys[0];

			// tslint:disable-next-line:prefer-for-of
			for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
				if (current[keys[keyIndex]] !== 0) {
					key = keys[keyIndex];

					break;
				}
			}

			current[key] += 10;

			durability.push({...current});
		}

		this.props.onSave(durability);
	};
}
