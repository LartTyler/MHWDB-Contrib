import {FormGroup, H2, InputGroup, Intent, Spinner, TextArea} from '@blueprintjs/core';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {IApiClientAware, withApiClient} from '../../Contexts/ApiClientContext';
import {IToasterAware, withToasterContext} from '../../Contexts/ToasterContext';
import {Cell, Row} from '../../Grid';

interface IAilmentEditorRouteProps {
	ailment: string;
}

interface IAilmentEditorProps extends IApiClientAware, IToasterAware, RouteComponentProps<IAilmentEditorRouteProps> {
}

interface IAilmentEditorState {
	name: string;
	description: string;
	loading: boolean;
}

class AilmentEditorComponent extends React.PureComponent<IAilmentEditorProps, IAilmentEditorState> {
	public state: Readonly<IAilmentEditorState> = {
		description: '',
		loading: true,
		name: '',
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
				</form>
			</div>
		);
	}

	private onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
		name: event.currentTarget.value,
	});

	private onDescriptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
		description: event.currentTarget.value,
	});

	private loadAilment(): void {
		const ailmentId = parseInt(this.props.match.params.ailment, 10);

		this.props.client.ailments.get(ailmentId).then(ailment => this.setState({
			description: ailment.description,
			loading: false,
			name: ailment.name,
		}));
	}
}

export const AilmentEditor = withApiClient(withToasterContext(AilmentEditorComponent));
