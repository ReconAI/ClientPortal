import { PaginationResponseServerInterface, MetaClientInterface } from './../../constants/types/requests';
import { getUserPriorityByRole } from './../../core/helpers/priorities';
import { ResetPasswordInterface } from './../../constants/types/resetPassword';
import { SignUpRequestInterface } from './../signUp/signUp.server.helpers';
import {
  UserProfileFormUserInterface,
  UpdateUserServerRequestInterface,
  CLIENT_ROLE,
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
  UserRoleTypes,
} from 'app/constants/types';
import moment from 'moment';

export interface StoreUsersListInterface {
  list: UserInterface[];
  meta: MetaClientInterface;
}

export const transformUsersListResponseFromServer = (
  response: PaginationResponseServerInterface<ServerUserInterface>
): StoreUsersListInterface => ({
  list: response.results.map((user) => ({
    id: user.id,
    firstName: user.firstname,
    lastName: user.lastname,
    phone: user.phone,
    email: user.email,
    role: user.group.name.charAt(0).toUpperCase() + user.group.name.slice(1),
    isActive: user.is_active,
    createdDT: moment(user.created_dt).format('YYYY.MM.DD'),
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
    id: response.id,
    username: response.username,
    rolePriority: getUserPriorityByRole(response?.group?.name),
  },
});

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
  role: user.role,
});

export const transformActivateUserToClient = (
  user: ServerUserInterface
): UserProfileFormInterface => ({
  user: {
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    address: user.address,
    phone: user.phone,
  },
  profile: {
    username: user.username,
  },
});

export interface UpdateUserRequestInterface {
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
}

export const transformUpdateUserToServer = (
  user: UserProfileFormUserInterface
): UpdateUserRequestInterface => ({
  firstname: user.firstName,
  lastname: user.lastName,
  address: user.address,
  phone: user.phone,
});

export const getTitleOfInvitedRegistration = (
  roleName: UserRoleTypes
): string => {
  return roleName === CLIENT_ROLE
    ? `Client's registration`
    : `Registration for invited ${roleName}`;
};
