import { UserInterface } from './../../users/constants/types/user';
import {
  ServerUserInterface,
  ServerUserOrganizationInterface,
  UserProfileFormInterface,
} from 'app/constants/types';
import moment from 'moment';

export interface UsersListRequestInterface {
  page: number;
}

export interface UsersListResponseInterface {
  count: number;
  current: number;
  page_size: number;
  results: ServerUserInterface[];
}

interface MetaUsersListInterface {
  count: number;
  currentPage: number;
  pageSize: number;
}

export interface StoreUsersListInterface {
  list: UserInterface[];
  meta: MetaUsersListInterface;
}

export const transformUsersListResponseFromServer = (
  response: UsersListResponseInterface
): StoreUsersListInterface => ({
  list: response.results.map((user) => ({
    id: user.id,
    firstName: user.firstname,
    lastName: user.lastname,
    phone: user.phone,
    email: user.email,
    role: user.group.name.charAt(0).toUpperCase() + user.group.name.slice(1),
    isActive: user.is_active,
    createdDT: moment(user.created_dt).format('DD.MM.YYYY'),
  })),
  meta: {
    count: response.count,
    currentPage: response.current,
    pageSize: response.page_size,
  },
});

export interface ServerUserProfileInterface extends ServerUserInterface {
  organization: ServerUserOrganizationInterface;
}

export interface UserProfileRequestInterface {
  id: string;
}

export const transformUserProfileResponseFromServer = (
  response: ServerUserProfileInterface
): UserProfileFormInterface => ({
  organization: {
    name: response.organization.name,
    phone: response.organization.main_phone,
    email: response.organization.main_email,
    address: response.organization.main_address,
    vat: response.organization.vat,
    firstName: response.organization.main_firstname,
    lastName: response.organization.main_lastname,
  },
  user: {
    phone: response.phone,
    email: response.email,
    address: response.address,
    firstName: response.firstname,
    lastName: response.lastname,
  },
  invoicing: {
    phone: response.organization.inv_phone,
    email: response.organization.inv_email,
    address: response.organization.inv_address,
    firstName: response.organization.inv_firstname,
    lastName: response.organization.inv_lastname,
  },
});