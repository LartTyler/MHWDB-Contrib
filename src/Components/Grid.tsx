import * as React from 'react';

interface IBreakpoints<T> {
	[key: string]: T;
	xs?: T;
	sm?: T;
	md?: T;
	lg?: T;
}

interface IColumnProps {
	size: number | IBreakpoints<number>;
	offset?: number | IBreakpoints<number>;
	className?: string;
}

export const Cell: React.SFC<IColumnProps> = props => {
	const {size, offset} = props;

	const classes: string[] = [];

	if (typeof size === 'object')
		Object.keys(size).forEach(key => classes.push(`col-${key}-${size[key]}`));
	else
		classes.push(`col-xs-${size}`);

	if (typeof offset === 'object')
		Object.keys(offset).forEach(key => classes.push(`col-${key}-offset-${offset[key]}`));
	else if (offset)
		classes.push(`col-xs-offset-${offset}`);

	return (
		<div className={`${classes.join(' ')} ${props.className || ''}`}>
			{props.children}
		</div>
	);
};

type Alignment = 'start' | 'center' | 'end';
type VerticalAlignment = 'top' | 'middle' | 'bottom';
type Distribution = 'around' | 'between';

interface IRowProps {
	align?: Alignment | IBreakpoints<Alignment>;
	valign?: VerticalAlignment | IBreakpoints<VerticalAlignment>;
	distribution?: Distribution | IBreakpoints<Distribution>;
	reverse?: boolean;
	className?: string;
}

export const Row: React.SFC<IRowProps> = props => {
	const {align, valign, distribution} = props;

	const classes: string[] = ['row'];

	if (typeof align === 'object')
		Object.keys(align).forEach(key => classes.push(`${align[key]}-${key}`));
	else if (align)
		classes.push(`${align}-xs`);

	if (typeof valign === 'object')
		Object.keys(valign).forEach(key => classes.push(`${valign[key]}-${key}`));
	else if (valign)
		classes.push(`${valign}-xs`);

	if (typeof distribution === 'object')
		Object.keys(distribution).forEach(key => classes.push(`${distribution[key]}-${key}`));
	else if (distribution)
		classes.push(`${distribution}-xs`);

	return (
		<div className={`${classes.join(' ')} ${props.className || ''}`}>
			{props.children}
		</div>
	);
};
