import * as React from 'react';
import {Route} from 'react-router';
import {ContentContainer} from '../ContentContainer';
import {Switch} from '../Navigation/Switch';
import {Ailments} from './Ailments';
import {Armor} from './Armor';
import {ArmorSetBonuses} from './ArmorSetBonuses';
import {ArmorSets} from './ArmorSets';
import {Charms} from './Charms';
import {Decorations} from './Decorations';
import {Items} from './Items';
import {Locations} from './Locations';
import {Monsters} from './Monsters';
import {MotionValues} from './MotionValues';
import {Skills} from './Skills';
import {Weapons} from './Weapons';

export const Editors: React.FC<{}> = () => (
	<ContentContainer>
		<Switch>
			<Route path="/objects/ailments" component={Ailments} />
			<Route path="/objects/armor" component={Armor} />
			<Route path="/objects/armor-sets/bonuses" component={ArmorSetBonuses} />
			<Route path="/objects/armor-sets" component={ArmorSets} />
			<Route path="/objects/charms" component={Charms} />
			<Route path="/objects/decorations" component={Decorations} />
			<Route path="/objects/items" component={Items} />
			<Route path="/objects/locations" component={Locations} />
			<Route path="/objects/monsters" component={Monsters} />
			<Route path="/objects/motion-values" component={MotionValues} />
			<Route path="/objects/skills" component={Skills} />
			<Route path="/objects/weapons" component={Weapons} />
		</Switch>
	</ContentContainer>
);
