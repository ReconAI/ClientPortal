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

export const DEFAULT_AUTHORIZED_USER_ROLE: UserRoleTypes = CLIENT_ROLE;
export const DEFAULT_AUTHORIZED_USER_ROLE_PRIORITY: UserRolesPriorities =
  UserRolesPriorities.CLIENT_ROLE;

export interface UserProfileFormOrganizationInterface {
  name: string;
  phone: string;
  email: string;
  address: string;
  vat: string;
  firstName: string;
  lastName: string;
}

export interface CredentialsRequestInterface {
  username: string;
  password1?: string;
  password2?: string;
}

export interface UserProfileFormUserInterface {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

export interface UserProfileFormInvoicingInterface {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

export interface UserProfileFormInterface {
  organization?: UserProfileFormOrganizationInterface;
  user: UserProfileFormUserInterface;
  invoicing?: UserProfileFormInvoicingInterface;
  profile?: CredentialsRequestInterface;
}

export interface ServerUserInterface {
  id: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  email: string;
  user_level: number;
  is_active: boolean;
  created_dt: string;
  group: {
    name: UserRoleTypes;
  };
  organization?: ServerUserOrganizationInterface;
  username: string;
}

export interface ServerUserOrganizationInterface {
  name: string;
  vat: string;
  main_firstname: string;
  main_lastname: string;
  main_address: string;
  main_phone: string;
  main_email: string;
  inv_firstname: string;
  inv_lastname: string;
  inv_address: string;
  inv_phone: string;
  inv_email: string;
}

export const SERVER_USER_ROLES = [
  {
    title: 'Super admin',
    value: 'super_admin',
  },
  {
    title: 'Admin',
    value: 'admin',
  },
  {
    title: 'Developer',
    value: 'developer',
  },
  {
    title: 'Client',
    value: 'client',
  },
];

export const signUpRelationsFormAnsServerFields = {
  username: 'Login',
  email: 'User email',
  firstname: 'User first name',
  lastname: 'User last name',
  address: 'User address',
  phone: 'User phone',
  password1: 'Password',
  password2: 'Confirmation password',
  name: 'Organization name',
  vat: 'Organization VAT',
  main_firstname: 'Contact person first name',
  main_lastname: 'Contact person last name',
  main_address: 'Organization address',
  main_phone: 'Organization phone',
  main_email: 'Organization email',
  inv_firstname: 'Invoicing first name',
  inv_lastname: 'Invoicing last name',
  inv_address: 'Invoicing address',
  inv_phone: 'Invoicing phone',
  inv_email: 'Invoicing email',
};
