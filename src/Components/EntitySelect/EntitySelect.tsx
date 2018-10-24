import {Button, Intent, MenuItem, Spinner} from '@blueprintjs/core';
import {IItemRendererProps, IMultiSelectProps, ISelectProps, MultiSelect, Select} from '@blueprintjs/select';
import * as React from 'react';
import {IApiClientModule} from '../../Api/Module';
import {IEntity} from '../../Api/Objects/Entity';

interface IEntitySelectProps<T extends IEntity> {
	provider: IApiClientModule<T>;
	labelField: keyof T;
	multiSelect?: boolean;
	initialSelection?: T[];
}

type SelectProps<T> = ISelectProps<T> | IMultiSelectProps<T>;

const assertMultiSelectProps = <T extends IEntity>(value: any): value is IMultiSelectProps<T> => true;

interface IEntitySelectState<T extends IEntity> {
	SelectComponent: React.ComponentType<SelectProps<T>>;
	entities: T[];
	loading: boolean;
	selected: T[];
}

export class EntitySelect<T extends IEntity> extends React.PureComponent<IEntitySelectProps<T>, IEntitySelectState<T>> {
	public constructor(props: IEntitySelectProps<T>) {
		super(props);

		const initial: T[] = [];

		this.state = {
			SelectComponent: this.props.multiSelect ? MultiSelect.ofType<T>() : Select.ofType<T>(),
			entities: [],
			loading: true,
			selected: initial,
		};
	}

	public componentDidMount(): void {
		this.props.provider.list(null, {
			id: true,
			[this.props.labelField]: true,
		}).then(entities => {
			this.setState({
				entities: entities.sort(this.compareEntities),
				loading: false,
			}, () => {
				if (!this.props.initialSelection || !this.props.initialSelection.length)
					return;

				const initialIds = this.props.initialSelection.map(item => item.id);

				this.setState({
					selected: this.state.entities.filter(item => initialIds.indexOf(item.id) > -1),
				});
			});
		});
	}

	public render(): JSX.Element {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />;

		const {SelectComponent, selected} = this.state;

		const selectProps: SelectProps<T> = {
			itemPredicate: this.filterItem,
			itemRenderer: this.renderItem,
			items: this.state.entities,
			onItemSelect: this.onItemSelect,
			placeholder: 'Make a selection...',
			popoverProps: {
				targetClassName: 'full-width',
			},
		};

		if (this.props.multiSelect && assertMultiSelectProps<T>(selectProps)) {
			selectProps.tagRenderer = this.renderTag;
			selectProps.selectedItems = this.state.selected;
			selectProps.tagInputProps = {
				onRemove: this.onTagRemove,
				rightElement: selected.length ?
					<Button icon="cross" minimal={true} onClick={this.onClearButtonClick} /> : null,
			};
		}

		return (
			<div>
				<SelectComponent {...selectProps}>
					{!this.props.multiSelect && (
						<Button
							text={selected.length ? selected[0][this.props.labelField] : 'No selection'}
							rightIcon="caret-down"
						/>
					)}
				</SelectComponent>
			</div>
		);
	}

	private renderItem = (item: T, itemProps: IItemRendererProps) => {
		return (
			<MenuItem
				icon={this.state.selected.indexOf(item) > -1 ? 'tick' : 'blank'}
				active={itemProps.modifiers.active}
				key={item.id}
				text={item[this.props.labelField]}
				onClick={itemProps.handleClick}
			/>
		);
	};

	private renderTag = (item: T) => item[this.props.labelField];

	private filterItem = (query: string, item: T) =>
		item[this.props.labelField].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;

	private onItemSelect = (item: T) => {
		let {selected} = this.state;

		if (this.props.multiSelect) {
			if (selected.indexOf(item) > -1)
				selected = selected.filter(value => value !== item);
			else
				selected.push(item);
		} else
			selected = [item];

		this.setState({
			selected: [...selected],
		});
	};

	private onTagRemove = (tag: string, index: number) => this.setState({
		selected: this.state.selected.filter((item, i) => i !== index),
	});

	private onClearButtonClick = () => this.setState({
		selected: [],
	});

	private compareEntities = (a: T, b: T): number => {
		const aVal = a[this.props.labelField].toString();
		const bVal = b[this.props.labelField].toString();

		if (aVal < bVal)
			return -1;
		else if (aVal > bVal)
			return 1;

		return 0;
	};
}
