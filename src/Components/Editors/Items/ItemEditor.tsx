import {Button, FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import {Cell, Row} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router';
import {IItem} from '../../../Api/Objects/Item';
import {Projection} from '../../../Api/Projection';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {LinkButton} from '../../Navigation/LinkButton';

const cleanIntegerString = (input: string, max: number = null): string => {
	let output = parseInt(input.replace(/[^\d.]/, ''), 10);

	if (isNaN(output))
		return '';

	if (max !== null)
		output = Math.min(output, max);

	return Math.abs(output).toString(10);
};

const toInteger = (input: string): number => {
	const value = parseInt(input, 10);

	return isNaN(value) ? 0 : value;
};

interface IRouteProps {
	item: string;
}

interface IItemEditorProps extends IApiClientAware, IToasterAware, RouteComponentProps<IRouteProps> {
}

interface IItemEditorState {
	carryLimit: string;
	description: string;
	loading: boolean;
	name: string;
	rarity: string;
	redirect: boolean;
	saving: boolean;
	value: string;
}

class ItemEditorComponent extends React.PureComponent<IItemEditorProps, IItemEditorState> {
	public state: Readonly<IItemEditorState> = {
		carryLimit: '0',
		description: '',
		loading: false,
		name: '',
		rarity: '0',
		redirect: false,
		saving: false,
		value: '0',
	};

	public componentDidMount(): void {
		this.loadItem();
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;
		else if (this.state.redirect)
			return <Redirect to="/edit/items" />;

		return (
			<>
				<H2>{this.state.name.length ? this.state.name : 'Unnamed'}</H2>

				<form>
					<Row>
						<Cell size={6}>
							<FormGroup label="Name" labelFor="name">
								<InputGroup name="name" onChange={this.onNameChange} value={this.state.name} />
							</FormGroup>
						</Cell>

						<Cell size={2}>
							<FormGroup label="Rarity" labelFor="rarity">
								<InputGroup name="rarity" onChange={this.onRarityChange} value={this.state.rarity} />
							</FormGroup>
						</Cell>

						<Cell size={2}>
							<FormGroup label="Value" labelFor="value">
								<InputGroup name="value" onChange={this.onValueChange} value={this.state.value} />
							</FormGroup>
						</Cell>

						<Cell size={2}>
							<FormGroup label="Carry Limit" labelFor="carryLimit">
								<InputGroup
									name="carryLimit"
									onChange={this.onCarryLimitChange}
									value={this.state.carryLimit}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={12}>
							<FormGroup label="Description" labelFor="description">
								<TextArea
									fill={true}
									name="description"
									onChange={this.onDescriptionChange}
									value={this.state.description}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<Row align="end">
						<Cell size={1}>
							<LinkButton to="/edit/items" buttonProps={{fill: true, loading: this.state.saving}}>
								Cancel
							</LinkButton>
						</Cell>

						<Cell size={1}>
							<Button intent={Intent.PRIMARY} fill={true} loading={this.state.saving} onClick={this.save}>
								Save
							</Button>
						</Cell>
					</Row>
				</form>
			</>
		);
	}

	private onCarryLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		carryLimit: cleanIntegerString(event.currentTarget.value),
	});

	private onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRarityChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		rarity: cleanIntegerString(event.currentTarget.value, 8),
	});

	private onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		value: cleanIntegerString(event.currentTarget.value),
	});

	private loadItem = () => {
		const idParam = this.props.match.params.item;

		if (idParam === 'new') {
			this.setState({
				loading: false,
			});

			return;
		}

		this.props.client.items.get(parseInt(idParam, 10)).then(item => this.setState({
			carryLimit: item.carryLimit.toString(10),
			description: item.description,
			loading: false,
			name: item.name,
			rarity: item.rarity.toString(10),
			value: item.value.toString(10),
		}));
	};

	private save = (event?: React.SyntheticEvent<any>) => {
		if (event)
			event.preventDefault();

		if (this.state.saving)
			return;

		this.setState({
			saving: true,
		});

		const payload: IItem = {
			carryLimit: toInteger(this.state.carryLimit),
			description: this.state.description,
			name: this.state.name,
			rarity: toInteger(this.state.rarity),
			value: toInteger(this.state.value),
		};

		const projection: Projection = {
			name: true,
		};

		const idParam = this.props.match.params.item;
		let promise: Promise<IItem>;

		if (idParam === 'new')
			promise = this.props.client.items.create(payload, projection);
		else
			promise = this.props.client.items.update(parseInt(idParam, 10), payload, projection);

		promise.then(item => {
			this.props.toaster.show({
				intent: Intent.SUCCESS,
				message: `${item.name} ${idParam === 'new' ? 'created' : 'saved'} successfully.`,
			});

			this.setState({
				redirect: true,
			});
		}).catch((error: Error) => {
			this.props.toaster.show({
				intent: Intent.DANGER,
				message: error.message,
			});

			this.setState({
				saving: false,
			});
		});
	};
}

export const ItemEditor = withApiClient(withToasterContext(withRouter(ItemEditorComponent)));
