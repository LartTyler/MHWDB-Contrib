import {ChimeraSelect, ChimeraSelectProps} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Entity} from '../../Api/Model';

interface IProps<T extends Entity> {
	labelField: keyof T;
	config: ChimeraSelectProps<T>;
}

export class EntitySelect<T extends Entity> extends React.PureComponent<IProps<T>, {}> {
	public render(): React.ReactNode {
		const config = {...this.props.config};

		if (typeof config.itemKey === 'undefined')
			config.itemKey = 'id';

		return (
			<ChimeraSelect
				{...config}
				itemTextRenderer={this.renderEntityText}
				virtual={true}
			/>
		);
	}

	private renderEntityText = (item: T) => item[this.props.labelField];

	public static ofType = <T extends any>() => EntitySelect as new (props: IProps<T>) => EntitySelect<T>;
}
