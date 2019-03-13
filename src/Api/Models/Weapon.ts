export enum WeaponType {
	GREAT_SWORD = 'great-sword',
	LONG_SWORD = 'long-sword',
	SWORD_AND_SHIELD = 'sword-and-shield',
	DUAL_BLADES = 'dual-blades',
	HAMMER = 'hammer',
	HUNTING_HORN = 'hunting-horn',
	LANCE = 'lance',
	GUNLANCE = 'gunlance',
	SWITCH_AXE = 'switch-axe',
	CHARGE_BLADE = 'charge-blade',
	INSECT_GLAIVE = 'insect-glaive',
	LIGHT_BOWGUN = 'light-bowgun',
	HEAVY_BOWGUN = 'heavy-bowgun',
	BOW = 'bow',
}

export const weaponTypeLabels: {[key in WeaponType]: string} = {
	[WeaponType.BOW]: 'Bow',
	[WeaponType.CHARGE_BLADE]: 'Charge Blade',
	[WeaponType.DUAL_BLADES]: 'Dual Blades',
	[WeaponType.GREAT_SWORD]: 'Great Sword',
	[WeaponType.GUNLANCE]: 'Gunlance',
	[WeaponType.HAMMER]: 'Hammer',
	[WeaponType.HEAVY_BOWGUN]: 'Heavy Bowgun',
	[WeaponType.HUNTING_HORN]: 'Hunting Horn',
	[WeaponType.INSECT_GLAIVE]: 'Insect Glaive',
	[WeaponType.LANCE]: 'Lance',
	[WeaponType.LIGHT_BOWGUN]: 'Light Bowgun',
	[WeaponType.LONG_SWORD]: 'Long Sword',
	[WeaponType.SWITCH_AXE]: 'Switch Axe',
	[WeaponType.SWORD_AND_SHIELD]: 'Sword and Shield',
};

export enum DamageType {
	BLUNT = 'blunt',
	PIERCING = 'piercing',
	SEVER = 'sever',
}
