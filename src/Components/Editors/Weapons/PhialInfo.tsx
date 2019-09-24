import {InputGroup} from '@blueprintjs/core';
import {Cell, Row, Select} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {IConstraintViolations} from '../../../Api/Error';
import {DamagePhialType, PhialType, PhialTypes} from '../../../Api/Models/Weapon';
import {cleanNumberString} from '../../../Utility/number';
import {filterStrings} from '../../../Utility/select';
import {ucwords} from '../../../Utility/string';
import {ValidationAwareFormGroup} from '../../ValidationAwareFormGroup';

const damagePhialTypes: string[] = Object.values(DamagePhialType);
const allPhialTypes = (Object.values(PhialType) as string[]).concat(damagePhialTypes).sort();

interface IProps {
	onChange: (type: PhialTypes, damage: number) => void;
	readOnly: boolean;
	type: PhialTypes;

	damage?: string;
	violations?: IConstraintViolations;
}

export const PhialInfo: React.FC<IProps> = props => {
	const hasDamage = damagePhialTypes.indexOf(props.type) !== -1;

	return (
		<Row>
			<Cell size={hasDamage ? 6 : 12}>
				<ValidationAwareFormGroup label="Phial Type" labelFor="phial.type" violations={props.violations}>
					<Select
						disabled={props.readOnly}
						items={allPhialTypes}
						itemListPredicate={filterStrings}
						itemTextRenderer={ucwords}
						onItemSelect={(type: PhialTypes) => {
							let damage: number;

							if (damagePhialTypes.indexOf(type) !== -1)
								damage = props.damage ? parseInt(props.damage, 10) : null;
							else
								damage = null;

							props.onChange(type, damage);
						}}
						popoverProps={{
							targetClassName: 'full-width',
						}}
						selected={props.type}
					/>
				</ValidationAwareFormGroup>
			</Cell>

			{hasDamage && (
				<Cell size={6}>
					<ValidationAwareFormGroup
						label="Phial Damage"
						labelFor="phial.damage"
						violations={props.violations}
					>
						<InputGroup
							name="phial.damage"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								const damage = cleanNumberString(event.currentTarget.value, false);

								props.onChange(props.type, damage ? parseInt(damage, 10) : null);
							}}
							readOnly={props.readOnly}
							value={props.damage || ''}
						/>
					</ValidationAwareFormGroup>
				</Cell>
			)}
		</Row>
	);
};

PhialInfo.defaultProps = {
	damage: null,
};
