import {MenuItem} from '@blueprintjs/core';
import {IItemRendererProps} from '@blueprintjs/select';
import * as React from 'react';
import {Select} from './Select';

interface IStringSelectProps {
	dataSource: string[];
	selected: string[];

	loadingSpinner?: React.ReactNode;
	multiSelect?: boolean;
	onClear?: () => void;
	onItemDeselect?: (item: string) => void;
	onItemSelect?: (item: string) => void;
	placeholder?: string;
	search?: boolean;
	valueRenderer?: (item: string) => React.ReactNode;
}

export class StringSelect extends React.PureComponent<IStringSelectProps, {}> {
	public render(): JSX.Element {
		return (
			<Select
				dataSource={this.props.dataSource}
				itemPredicate={this.props.search ? this.filterItem : null}
				itemRenderer={this.renderItem}
				loadingSpinner={this.props.loadingSpinner}
				multiSelect={this.props.multiSelect}
				onClear={this.props.onClear}
				onItemDeselect={this.props.onItemDeselect}
				onItemSelect={this.props.onItemSelect}
				placeholder={this.props.placeholder}
				selected={this.props.selected}
				tagRenderer={this.renderText}
				valueRenderer={this.renderText}
			/>
		);
	}

	private renderItem = (item: string, itemProps: IItemRendererProps) => (
		<MenuItem
			active={itemProps.modifiers.active}
			icon={this.props.selected.indexOf(item) > -1 ? 'tick' : 'blank'}
			key={item}
			onClick={itemProps.handleClick}
			text={this.renderText(item)}
		/>
	);

	private renderText = (item: string) => this.props.valueRenderer ? this.props.valueRenderer(item) : item;

	private filterItem = (query: string, item: string) => item.toLowerCase().indexOf(query.toLowerCase()) > -1;
}
