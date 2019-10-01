import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {IConstraintViolations} from '../../../Api/Error';
import {IShellingInfo, ShellingType} from '../../../Api/Models/Weapons/Gunlance';
import {range} from '../../../Utility/array';
import {ucfirst} from '../../../Utility/string';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';

interface IProps {
	onChange: (type: ShellingType, level: number) => void;
	readOnly: boolean;
	shelling: IShellingInfo;
	violations: IConstraintViolations;
}

export const ShellingInfo: React.FC<IProps> = props => (
	<Row>
		<Cell size={8}>
			<ValidationAwareFormGroup label="Shelling Type" labelFor="shelling.type" violations={props.violations}>
				<Select
					disabled={props.readOnly}
					filterable={false}
					items={Object.values(ShellingType)}
					itemTextRenderer={ucfirst}
					onItemSelect={(type: ShellingType) => props.onChange(type, props.shelling.level)}
					popoverProps={{
						targetClassName: 'full-width',
					}}
					selected={props.shelling.type}
				/>
			</ValidationAwareFormGroup>
		</Cell>

		<Cell size={4}>
			<ValidationAwareFormGroup label={<span>&nbsp;</span>} labelFor="shelling.level" violations={props.violations}>
				<Select
					disabled={props.readOnly}
					filterable={false}
					items={range(1, 4)}
					itemTextRenderer={(level: number) => `Level ${level}`}
					onItemSelect={(level: number) => props.onChange(props.shelling.type, level)}
					popoverProps={{
						targetClassName: 'full-width',
					}}
					selected={props.shelling.level}
				/>
			</ValidationAwareFormGroup>
		</Cell>
	</Row>
);
