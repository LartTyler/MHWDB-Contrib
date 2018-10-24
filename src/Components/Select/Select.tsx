import {Alignment, Button, Intent, Spinner} from '@blueprintjs/core';
import {
	IMultiSelectProps as IBaseMultiSelectProps,
	ISelectProps as IBaseSelectProps,
	ItemListRenderer,
	ItemRenderer,
	MultiSelect as BaseMultiSelect,
	Select as BaseSelect,
} from '@blueprintjs/select';
import * as React from 'react';

interface ISelectProps<T> {
	dataSource: T[];
	itemRenderer: ItemRenderer<T>;
	selected: T[];
	valueRenderer: (item: T) => React.ReactNode;

	itemListRenderer?: ItemListRenderer<T>;
	itemPredicate?: (query: string, item: T) => boolean;
	loading?: boolean;
	loadingSpinner?: React.ReactNode;
	multiSelect?: boolean;
	noResults?: React.ReactNode;
	onClear?: () => void;
	onItemDeselect?: (item: T) => void;
	onItemSelect?: (item: T) => void;
	placeholder?: string;
	tagRenderer?: (item: T) => React.ReactNode;
}

type BaseSelectProps<T> = IBaseSelectProps<T> | IBaseMultiSelectProps<T>;
const assertMultiSelectProps = <T extends any>(value: any): value is IBaseMultiSelectProps<T> => true;

interface ISelectState<T> {
	SelectComponent: React.ComponentType<BaseSelectProps<T>>;
}

export class Select<T> extends React.PureComponent<ISelectProps<T>, ISelectState<T>> {
	public constructor(props: ISelectProps<T>) {
		super(props);

		this.state = {
			SelectComponent: props.multiSelect ? BaseMultiSelect.ofType<T>() : BaseSelect.ofType<T>(),
		};
	}

	public render(): JSX.Element {
		if (this.props.loading) {
			return (
				<>
					{this.props.loadingSpinner || <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />}
				</>
			);
		}

		const selected = this.props.selected;
		const SelectComponent = this.state.SelectComponent;

		const selectProps: BaseSelectProps<T> = {
			itemListRenderer: this.props.itemListRenderer,
			itemPredicate: this.props.itemPredicate,
			itemRenderer: this.props.itemRenderer,
			items: this.props.dataSource,
			noResults: this.props.noResults || <span>No results found.</span>,
			onItemSelect: this.onItemSelect,
			placeholder: this.props.placeholder,
			popoverProps: {
				targetClassName: 'full-width',
			},
		};

		if (this.props.multiSelect && assertMultiSelectProps<T>(selectProps)) {
			selectProps.tagRenderer = this.props.tagRenderer;
			selectProps.selectedItems = this.props.selected;
			selectProps.tagInputProps = {
				onRemove: this.onTagRemove,
				rightElement: selected.length ?
					<Button icon="cross" minimal={true} onClick={this.props.onClear} /> : null,
			};
		}

		return (
			<SelectComponent {...selectProps}>
				{!this.props.multiSelect && (
					<Button
						alignText={Alignment.LEFT}
						className="text-left"
						text={selected.length ? this.props.valueRenderer(selected[0]) : 'No selection'}
						rightIcon="caret-down"
						fill={true}
					/>
				)}
			</SelectComponent>
		);
	}

	private onTagRemove = (tag: string, index: number) => {
		if (!this.props.onItemDeselect)
			return;

		this.props.onItemDeselect(this.props.selected[index]);
	};

	private onItemSelect = (item: T) => {
		const callback = this.props.selected.indexOf(item) > -1 ? this.props.onItemDeselect : this.props.onItemSelect;

		if (!callback)
			return;

		callback(item);
	};
}
