import {FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {RecoveryAction} from '../../../Api/Objects/Ailment';
import {IItem} from '../../../Api/Objects/Item';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {Cell, Row} from '../../Grid';
import {EntitySelect} from '../../Select/EntitySelect';
import {StringSelect} from '../../Select/StringSelect';

interface IAilmentEditorRouteProps {
	ailment: string;
}

interface IAilmentEditorProps extends IApiClientAware, IToasterAware, RouteComponentProps<IAilmentEditorRouteProps> {
}

interface IAilmentEditorState {
	description: string;
	loading: boolean;
	name: string;
	recoveryActions: RecoveryAction[];
	recoveryItems: IItem[];
}

class AilmentEditorComponent extends React.PureComponent<IAilmentEditorProps, IAilmentEditorState> {
	public state: Readonly<IAilmentEditorState> = {
		description: '',
		loading: true,
		name: '',
		recoveryActions: [],
		recoveryItems: [],
	};

	public componentDidMount(): void {
		this.loadAilment();
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return <Spinner intent={Intent.PRIMARY} />;

		return (
			<div>
				<H2>{this.state.name.length ? this.state.name : <span>Unnamed</span>}</H2>

				<form>
					<Row>
						<Cell size={6}>
							<FormGroup label="Name" labelFor="name">
								<InputGroup name="name" value={this.state.name} onChange={this.onNameInputChange} />
							</FormGroup>
						</Cell>
					</Row>

					<Row>
						<Cell size={12}>
							<FormGroup label="Description" labelFor="description">
								<TextArea
									name="description"
									value={this.state.description}
									className="full-width"
									onChange={this.onDescriptionInputChange}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H2>Recovery</H2>

					<Row>
						<Cell size={6}>
							<FormGroup label="Items">
								<EntitySelect
									labelField="name"
									multiSelect={true}
									onClear={this.onRecoveryItemsClear}
									onItemDeselect={this.onRecoveryItemsDeselect}
									onItemSelect={this.onRecoveryItemsSelect}
									onSelectionLoad={this.onRecoveryItemsLoad}
									provider={this.props.client.items}
									selected={this.state.recoveryItems}
								/>
							</FormGroup>
						</Cell>

						<Cell size={6}>
							<FormGroup label="Actions">
								<StringSelect
									dataSource={[RecoveryAction.DODGE]}
									multiSelect={true}
									onClear={this.onRecoveryActionsClear}
									onItemDeselect={this.onRecoveryActionsDeselect}
									onItemSelect={this.onRecoveryActionsSelect}
									selected={this.state.recoveryActions}
								/>
							</FormGroup>
						</Cell>
					</Row>

					<H2>Protection</H2>
				</form>
			</div>
		);
	}

	private onDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onRecoveryActionsClear = () => this.setState({
		recoveryActions: [],
	});

	private onRecoveryActionsDeselect = (removed: RecoveryAction) => this.setState({
		recoveryActions: this.state.recoveryActions.filter(item => item !== removed),
	});

	private onRecoveryActionsSelect = (item: RecoveryAction) => this.setState({
		recoveryActions: [...this.state.recoveryActions, item],
	});

	private onRecoveryItemsClear = () => this.setState({
		recoveryItems: [],
	});

	private onRecoveryItemsDeselect = (removed: IItem) => this.setState({
		recoveryItems: this.state.recoveryItems.filter(item => item.id !== removed.id),
	});

	private onRecoveryItemsSelect = (item: IItem) => this.setState({
		recoveryItems: [...this.state.recoveryItems, item],
	});

	private onRecoveryItemsLoad = (selected: IItem[]) => this.setState({
		recoveryItems: selected,
	});

	private loadAilment(): void {
		const ailmentId = parseInt(this.props.match.params.ailment, 10);

		this.props.client.ailments.get(ailmentId).then(ailment => this.setState({
			description: ailment.description,
			loading: false,
			name: ailment.name,
			recoveryItems: ailment.recovery.items,
		}));
	}
}

export const AilmentEditor = withApiClient(withToasterContext(AilmentEditorComponent));
