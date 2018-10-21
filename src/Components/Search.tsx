import {Button, InputGroup} from '@blueprintjs/core';
import * as React from 'react';

interface ISearchInputProps {
	onSearch: (value: string) => void;
}

interface ISearchInputState {
	text: string;
}

export class SearchInput extends React.Component<ISearchInputProps, ISearchInputState> {
	public state: Readonly<ISearchInputState> = {
		text: '',
	};

	public render(): JSX.Element {
		return (
			<InputGroup
				onChange={this.onInputChange}
				leftIcon="search"
				value={this.state.text}
				type="search"
			/>
		);
	}

	private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			text: event.target.value,
		}, () => {
			this.props.onSearch(this.state.text);
		});
	};

	private onInputClear = () => {
		this.setState({
			text: '',
		}, () => {
			this.props.onSearch(this.state.text);
		});
	};
}
