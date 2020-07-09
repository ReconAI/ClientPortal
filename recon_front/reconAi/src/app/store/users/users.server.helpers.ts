import { ResetPasswordInterface } from './../../constants/types/resetPassword';
import { SignUpRequestInterface } from './../signUp/signUp.server.helpers';
import {
  UserProfileFormUserInterface,
  CredentialsRequestInterface,
} from './../../constants/types/user';
import { ActivationInterface } from './../../constants/types/activation';
import {
  UserInterface,
  AddUserInterface,
} from './../../users/constants/types/user';
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
  profile: {
    username: response.username,
  },
});

// it checks the length of data before removing and calculates new page
// it's the same if there's data and current page - 1 if there's no data
export const calculatePageAfterDelete = (
  currentPage: number,
  length: number
): number => {
  if (length > 1) {
    return currentPage;
  }

  return currentPage > 1 ? currentPage - 1 : 1;
};

interface AddUserServerInterface {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export const transformAddUserToServer = ({
  firstName,
  lastName,
  ...rest
}: AddUserInterface): AddUserServerInterface => ({
  firstname: firstName,
  lastname: lastName,
  ...rest,
});

export const transformInviteSignUpUserToServer = (
  user: UserProfileFormInterface,
  activation: ActivationInterface
): SignUpRequestInterface & ActivationInterface => ({
  username: user.profile.username,
  email: user.user.email,
  firstname: user.user.firstName,
  lastname: user.user.lastName,
  address: user.user.address,
  phone: user.user.phone,
  uidb64: activation.uidb64,
  token: activation.token,
  password1: user.profile.password1,
  password2: user.profile.password2,
});

export interface UpdateUserServerRequestInterface {
  username: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  role: string;
}

interface UpdateUserClientRequestInterface
  extends UserProfileFormUserInterface {
  username: string;
  role: string;
}

export const transformUserUpdateToServer = (
  user: UpdateUserClientRequestInterface
): UpdateUserServerRequestInterface => ({
  username: user.username,
  firstname: user.firstName,
  lastname: user.lastName,
  address: user.address,
  phone: user.phone,
  role: user.role
});
