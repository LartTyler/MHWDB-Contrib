import {Button, Classes, Dialog, InputGroup, Intent} from '@blueprintjs/core';
import {Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {IConstraintViolations} from '../../Api/Error';
import {CraftingCost, Item, ItemModel} from '../../Api/Models/Item';
import {Theme, ThemeContext} from '../Contexts/ThemeContext';
import {ValidationAwareFormGroup} from '../ValidationAwareFormGroup';
import {createEntitySorter} from './EntityList';

export const itemSorter = createEntitySorter<Item>('name');

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (cost: CraftingCost) => void;

	items?: Item[];
}

interface IState {
	item: Item;
	items: Item[];
	quantity: string;
	violations: IConstraintViolations;
}

export class CraftingCostDialog extends React.PureComponent<IProps, IState> {
	public constructor(props: IProps) {
		super(props);

		this.state = {
			item: null,
			items: props.items || null,
			quantity: '1',
			violations: null,
		};
	}

	public componentDidMount(): void {
		if (this.state.items)
			return;

		ItemModel.list().then(response => this.setState({
			items: response.data.sort(itemSorter),
		}));
	}

	public componentDidUpdate(prevProps: Readonly<IProps>): void {
		if (prevProps.isOpen === this.props.isOpen)
			return;

		this.setState({
			item: null,
			quantity: '1',
			violations: null,
		});
	}

	public render(): React.ReactNode {
		return (
			<ThemeContext.Consumer>
				{theme => (
					<Dialog
						className={theme === Theme.DARK ? Classes.DARK : ''}
						enforceFocus={false}
						isOpen={this.props.isOpen}
						onClose={this.props.onClose}
						title="Crafting Cost"
					>
						<div className={Classes.DIALOG_BODY}>
							<ValidationAwareFormGroup label="Item" labelFor="items" violations={this.state.violations}>
								<Select
									items={this.state.items}
									itemListPredicate={this.filterItemsList}
									itemTextRenderer={this.renderItemText}
									onItemSelect={this.onItemSelect}
									popoverProps={{
										targetClassName: 'full-width',
									}}
									selected={this.state.item}
									loading={this.state.items === null}
									virtual={true}
								/>
							</ValidationAwareFormGroup>

							<ValidationAwareFormGroup
								label="Quantity"
								labelFor="quantity"
								violations={this.state.violations}
							>
								<InputGroup
									name="quantity"
									onChange={this.onQuantityChange}
									value={this.state.quantity}
								/>
							</ValidationAwareFormGroup>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button onClick={this.props.onClose}>
									Cancel
								</Button>

								<Button intent={Intent.PRIMARY} onClick={this.onSaveClick}>
									Save
								</Button>
							</div>
						</div>
					</Dialog>
				)}
			</ThemeContext.Consumer>
		);
	}

	private filterItemsList = (query: string, items: Item[]) => {
		query = query.toLowerCase();

		return items.filter(item => item.name.toLowerCase().indexOf(query) !== -1);
	};

	private renderItemText = (item: Item) => item.name;

	private onItemSelect = (item: Item) => this.setState({
		item,
	});

	private onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		quantity: event.currentTarget.value,
	});

	private onSaveClick = () => {
		const violations: IConstraintViolations = {};

		if (!this.state.item) {
			violations.items = {
				code: null,
				message: 'This field cannot be blank',
				path: 'items',
			};
		}

		const quantity = parseInt(this.state.quantity, 10);

		if (isNaN(quantity) || quantity < 1) {
			violations.quantity = {
				code: null,
				message: 'This field must be a positive integer',
				path: 'quantity',
			};
		}

		if (Object.keys(violations).length > 0) {
			this.setState({
				violations,
			});

			return;
		}

		this.props.onSubmit({
			item: this.state.item,
			quantity,
		});
	};
}
