import {ChimeraSelect, ChimeraSelectProps} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Omit} from 'utility-types';
import {IApiClientModule} from '../../Api/Module';
import {IEntity} from '../../Api/Objects/Entity';
import {Projection} from '../../Api/Projection';

interface IProps<T extends IEntity> {
	labelField: keyof T;
	config: Omit<ChimeraSelectProps<T>, 'items' | 'loading'>;
	onSelectionLoad: (selected: T | T[]) => void;
	provider: IApiClientModule<T>;

	projection?: Projection;
	sorter?: (entities: T[]) => T[];
}

interface IState<T extends IEntity> {
	controller: AbortController;
	entities: T[];
	loading: boolean;
}

export class EntitySelect<T extends IEntity, M extends boolean> extends React.PureComponent<IProps<T>, IState<T>> {
	public state: Readonly<IState<T>> = {
		controller: null,
		entities: [],
		loading: true,
	};

	public componentDidMount(): void {
		const controller = new AbortController();

		this.setState({
			controller,
		});

		this.props.provider.list(null, this.props.projection || {
			id: true,
			[this.props.labelField]: true,
		}, controller.signal).then(entities => {
			if (this.props.sorter)
				entities = this.props.sorter(entities);

			this.setState({
				controller: null,
				entities,
				loading: false,
			});
		}, () => {
			const selected = this.props.config.selected;

			if (!selected)
				return;

			if (this.props.config.multi) {
				const ids = (selected as T[]).map(item => item.id);

				this.props.onSelectionLoad(this.state.entities.filter(entity => {
					return ids.indexOf(entity.id) !== -1;
				}));
			} else {
				for (const entity of this.state.entities) {
					if (entity.id === (selected as T).id) {
						this.props.onSelectionLoad(entity);

						break;
					}
				}
			}
		});
	}

	public componentWillUnmount(): void {
		if (this.state.controller)
			this.state.controller.abort();
	}

	public render(): React.ReactNode {
		const config = {...this.props.config};

		if (typeof config.itemKey === 'undefined')
			config.itemKey = 'id';

		return (
			<ChimeraSelect
				{...config}
				items={this.state.entities}
				itemTextRenderer={this.renderEntityText}
				loading={this.state.loading}
			/>
		);
	}

	private renderEntityText = (item: T) => item[this.props.labelField];
}
