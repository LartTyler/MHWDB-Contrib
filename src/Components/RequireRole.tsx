import * as React from 'react';
import {tokenStore} from '../Api/client';

export enum Role {
	ADMIN = 'ROLE_ADMIN',
	EDITOR = 'ROLE_EDITOR',
	USER = 'ROLE_USER',
}

type GrantedRoles = Role | Role[];

const hierarchy: { [key in Role]: GrantedRoles } = {
	[Role.ADMIN]: Role.EDITOR,
	[Role.EDITOR]: Role.USER,
	[Role.USER]: [],
};

export const isRoleGranted = (role: Role, roles: Role[]): boolean => {
	if (roles.indexOf(role) >= 0) {
		return true;
	}

	for (const key of roles) {
		if (!(key in hierarchy)) {
			continue;
		}

		const children = hierarchy[key];

		return isRoleGranted(role, typeof children === 'string' ? [children] : children);
	}

	return false;
};

interface IRequireRoleProps {
	role: Role;
}

export const RequireRole: React.FC<IRequireRoleProps> = ({role, children}) => {
	if (!tokenStore.isAuthenticated() || !isRoleGranted(role, tokenStore.getToken().body.roles))
		return null;

	return (
		<>
			{children}
		</>
	);
};
