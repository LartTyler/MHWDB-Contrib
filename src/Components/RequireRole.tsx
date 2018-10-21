import * as React from 'react';
import {IApiClientAware, withApiClient} from './Contexts/ApiClientContext';

export enum Role {
	ADMIN = 'ROLE_ADMIN',
	USER = 'ROLE_USER',
}

type GrantedRoles = Role | Role[];

const hierarchy: {[key in Role]: GrantedRoles} = {
	[Role.ADMIN]: Role.USER,
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

interface IRequireRoleProps extends IApiClientAware {
	role: Role;
}

const RequireRoleComponent: React.SFC<IRequireRoleProps> = ({client, role, children}) => {
	if (!client.isAuthenticated() || !isRoleGranted(role, client.getToken().body.roles)) {
		return null;
	}

	return (
		<>
			{children}
		</>
	);
};

export const RequireRole = withApiClient(RequireRoleComponent);
