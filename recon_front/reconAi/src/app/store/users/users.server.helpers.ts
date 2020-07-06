import { UserInterface } from './../../users/constants/types/user';
import { ServerUserInterface } from 'app/constants/types';
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
