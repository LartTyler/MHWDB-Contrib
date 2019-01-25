import {Button, Intent} from '@blueprintjs/core';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Confirm} from '../Confirm';

interface IRowControlsProps<T> {
	/**
	 * The entity that the controls should act on.
	 */
	entity: T;

	/**
	 * The router path to the entity's editor page.
	 */
	editPath: string;

	/**
	 * A callback to invoke when the delete button is clicked. Success is determined by the resolve / reject state of
	 * the promise.
	 */
	onDelete?: (entity: T) => Promise<void>;
}

interface IRowControlsState {
	loading: boolean;
}

export class RowControls<T> extends React.Component<IRowControlsProps<T>, IRowControlsState> {
	public state: Readonly<IRowControlsState> = {
		loading: false,
	};

	public static ofType<T>() {
		return RowControls as new (props: IRowControlsProps<T>) => RowControls<T>;
	}

	public render(): JSX.Element {
		return (
			<>
				<Link to={this.props.editPath} className="plain-link">
					<Button minimal={true} loading={this.state.loading}>
						Edit
					</Button>
				</Link>

				{this.props.onDelete && (
					<Confirm
						message={(
							<span>
								Are you sure you want to delete this item? This action cannot be undone.
							</span>
						)}
						onConfirm={this.onDeleteButtonClick}
					>
						<Button minimal={true} intent={Intent.DANGER} loading={this.state.loading}>
							Delete
						</Button>
					</Confirm>
				)}
			</>
		);
	}

	private onDeleteButtonClick = () => {
		this.setState({
			loading: true,
		});

		this.props.onDelete(this.props.entity).catch(() => this.setState({
			loading: false,
		}));
	};
}
