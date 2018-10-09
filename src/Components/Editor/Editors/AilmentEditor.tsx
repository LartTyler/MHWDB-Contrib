import * as React from 'react';
import {ApiClient} from '../../../Api';
import {Ailment} from '../../../Api/Objects/Ailment';

interface AilmentEditorState {
	ailments: Pick<Ailment, 'name' | 'id'>[];
}

export class AilmentEditor extends React.Component<{}, AilmentEditorState> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			ailments: [],
		};
	}

	public componentDidMount(): void {
		ApiClient.listAilments(null, {
			id: true,
			name: true,
		});
	}

	public render(): JSX.Element {
		return (
			<div id="ailment-editor-component">
				Coming soon.
			</div>
		);
	}
}