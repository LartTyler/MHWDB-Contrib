import {Button, Classes, Dialog, FormGroup, Intent} from '@blueprintjs/core';
import {Select, Table} from '@dbstudios/blueprintjs-components';
import * as React from 'react';
import {Slot} from '../../Api/Model';
import {Theme, ThemeContext} from '../Contexts/ThemeContext';

export const slotRanks = [
	1,
	2,
	3,
];

interface IProps {
	slots: Slot[];
	onChange: (slots: Slot[]) => void;
}

export const Slots: React.FC<IProps> = props => {
	const [showDialog, setShowDialog] = React.useState(false);
	const [selectedRank, setSelectedRank] = React.useState(1);

	return (
		<ThemeContext.Consumer>
			{theme => (
				<>
					<Table
						columns={[
							{
								dataIndex: 'rank',
								title: 'Rank',
							},
							{
								align: 'right',
								render: record => (
									<Button
										icon="cross"
										minimal={true}
										onClick={() => props.onChange(props.slots.filter(slot => slot !== record))}
									/>
								),
								title: <span>&nbsp;</span>,
							},
						]}
						dataSource={props.slots}
						fullWidth={true}
						noDataPlaceholder={<div style={{marginBottom: 5}}>This item has no slots.</div>}
					/>

					<Button disabled={props.slots.length === 3} icon="plus" onClick={() => setShowDialog(true)}>
						Add Slot
					</Button>

					<Dialog
						className={theme === Theme.DARK ? Classes.DARK : ''}
						isOpen={showDialog}
						onClose={() => setShowDialog(false)}
						title="Add Slot"
					>
						<div className={Classes.DIALOG_BODY}>
							<FormGroup label="Rank">
								<Select
									items={slotRanks}
									onItemSelect={rank => setSelectedRank(rank)}
									selected={selectedRank}
									popoverProps={{
										targetClassName: 'full-width',
									}}
								/>
							</FormGroup>
						</div>

						<div className={Classes.DIALOG_FOOTER}>
							<div className={Classes.DIALOG_FOOTER_ACTIONS}>
								<Button onClick={() => setShowDialog(false)}>
									Cancel
								</Button>

								<Button
									intent={Intent.PRIMARY}
									onClick={() => {
										props.onChange([
											...props.slots,
											{
												rank: selectedRank,
											},
										]);

										setShowDialog(false);
										setSelectedRank(1);
									}}
								>
									Save
								</Button>
							</div>
						</div>
					</Dialog>
				</>
			)}
		</ThemeContext.Consumer>
	);
};
