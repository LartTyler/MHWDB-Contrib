import {MenuItem} from '@blueprintjs/core';
import {IItemRendererProps} from '@blueprintjs/select';
import * as React from 'react';
import {IApiClientModule} from '../../Api/Module';
import {compareFields, IEntity} from '../../Api/Objects/Entity';
import {Select} from './Select';

interface IEntitySelectProps<T extends IEntity> {
	/**
	 * The field of T that should be used to render the select item's label. Must be compatible with
	 * {@see React.ReactNode}.
	 */
	labelField: keyof T;

	/**
	 * An {@see IApiClientModule<T>} that can be used to load the entity list.
	 */
	provider: IApiClientModule<T>;

	/**
	 * An array of entities that are currently selected. Object equality is handled automatically, using the `id` field
	 * of the entities in this property.
	 */
	selected: T[];

	/**
	 * A callback to invoke when the items in {@see selected} have been mapped to the items returned by the
	 * {@see provider}. Should be used to sync the parent's selected state to match what the select should actually
	 * contain.
	 */
	onSelectionLoad: (selected: T[]) => void;

	loadingSpinner?: React.ReactNode;
	multiSelect?: boolean;
	onClear?: () => void;
	onItemDeselect?: (item: T) => void;
	onItemSelect?: (item: T) => void;
	placeholder?: string;
	search?: boolean;
	sort?: boolean;
}

interface IEntitySelectState<T extends IEntity> {
	entities: T[];
	loading: boolean;
	selected: T[];
}

const getCurrentlySelected = <T extends IEntity>(entities: T[], selected: T[]) => {
	const ids = selected.map(item => item.id);

	return entities.filter(item => ids.indexOf(item.id) > -1);
};

export class EntitySelect<T extends IEntity>
	extends React.PureComponent<IEntitySelectProps<T>, IEntitySelectState<T>> {
	public static defaultProps: Partial<IEntitySelectProps<any>> = {
		search: true,
		sort: true,
	};

	public state: Readonly<IEntitySelectState<T>> = {
		entities: [],
		loading: true,
		selected: [],
	};

	public componentDidMount(): void {
		this.props.provider.list(null, {
			id: true,
			[this.props.labelField]: true,
		}).then(entities => {
			if (this.props.sort)
				entities = this.sortItems(entities);

			this.setState({
				entities,
				loading: false,
				selected: getCurrentlySelected(entities, this.props.selected),
			}, () => this.props.onSelectionLoad(this.state.selected));
		});
	}

	public componentDidUpdate(prevProps: IEntitySelectProps<T>, prevState: IEntitySelectState<T>): void {
		if (prevProps.selected === this.props.selected)
			return;

		this.setState({
			selected: getCurrentlySelected(this.state.entities, this.props.selected),
		});
	}

	public render(): JSX.Element {
		return (
			<Select
				dataSource={this.state.entities}
				itemPredicate={this.props.search ? this.filterItems : null}
				itemRenderer={this.renderItem}
				loading={this.state.loading}
				loadingSpinner={this.props.loadingSpinner}
				multiSelect={this.props.multiSelect}
				onClear={this.props.onClear}
				onItemDeselect={this.props.onItemDeselect}
				onItemSelect={this.props.onItemSelect}
				placeholder={this.props.placeholder}
				selected={this.props.selected}
				tagRenderer={this.renderValue}
				valueRenderer={this.renderValue}
			/>
		);
	}

	private renderItem = (item: T, itemProps: IItemRendererProps) => (
		<MenuItem
			active={itemProps.modifiers.active}
			icon={this.props.selected.indexOf(item) > -1 ? 'tick' : 'blank'}
			key={item.id}
			onClick={itemProps.handleClick}
			text={this.renderValue(item)}
		/>
	);

	private renderValue = (item: T) => item[this.props.labelField];

	private sortItems = (items: T[]) => items.sort((a, b) => compareFields(this.props.labelField, a, b));

	private filterItems = (query: string, item: T) => {
		return item[this.props.labelField].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
	};
}
