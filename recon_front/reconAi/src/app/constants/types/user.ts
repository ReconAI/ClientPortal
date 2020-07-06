export const UNAUTHORIZED_ROLE = 'unauthorized';
export const CLIENT_ROLE = 'client';
export const ADMIN_ROLE = 'admin';
export const SUPER_ADMIN_ROLE = 'superadmin';
export const DEVELOPER_ROLE = 'developer';

export type UNAUTHORIZED_TYPE_ROLE = 'unauthorized';
export type CLIENT_TYPE_ROLE = 'client';
export type ADMIN_TYPE_ROLE = 'admin';
export type SUPER_ADMIN_TYPE_ROLE = 'superadmin';
export type DEVELOPER_TYPE_ROLE = 'developer';

export enum UserRolesPriorities {
  UNAUTHORIZED_ROLE = 1,
  CLIENT_ROLE,
  ADMIN_ROLE,
  DEVELOPER_ROLE,
  SUPER_ADMIN_ROLE,
}

export const ROLES_AND_PRIORITIES_CONNECTIONS = {
  [UNAUTHORIZED_ROLE]: UserRolesPriorities.UNAUTHORIZED_ROLE,
  [CLIENT_ROLE]: UserRolesPriorities.CLIENT_ROLE,
  [ADMIN_ROLE]: UserRolesPriorities.ADMIN_ROLE,
  [DEVELOPER_ROLE]: UserRolesPriorities.DEVELOPER_ROLE,
  [SUPER_ADMIN_ROLE]: UserRolesPriorities.SUPER_ADMIN_ROLE,
};

export type UserRoleTypes =
  | CLIENT_TYPE_ROLE
  | ADMIN_TYPE_ROLE
  | DEVELOPER_TYPE_ROLE
  | SUPER_ADMIN_TYPE_ROLE
  | UNAUTHORIZED_TYPE_ROLE;

export const DEFAULT_USER_ROLE: UserRoleTypes = UNAUTHORIZED_ROLE;
export const DEFAULT_USER_ROLE_PRIORITY: UserRolesPriorities =
  UserRolesPriorities.UNAUTHORIZED_ROLE;

export interface UserProfileFormInterface {
  organization: {
    name: string;
    phone: string;
    email: string;
    address: string;
    vat: string;
  };
  user: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
  };
  invoicing: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface ServerUserInterface {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  email: string;
  user_level: number;
  is_active: boolean;
  group: {
    name: UserRoleTypes;
  };
  username: string;
}
