import * as React from 'react';
import {INumberDialogProps, NumberDialog} from './NumberDialog';

export const DefenseDialog: React.FC<INumberDialogProps> = props => <NumberDialog {...props} title="Defense" />;
