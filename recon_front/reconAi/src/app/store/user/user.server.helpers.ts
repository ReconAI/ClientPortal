import { ResetPasswordWithMetaInterface } from 'app/constants/types/resetPassword';
import { getUserPriorityByRole } from './../../core/helpers/priorities';
import { UserRolesPriorities, ServerUserInterface } from 'app/constants/types';
import {
  UserRoleTypes,
  DEFAULT_AUTHORIZED_USER_ROLE,
} from './../../constants/types/user';
import { HttpErrorResponse } from '@angular/common/http';
export interface UserTransformationResponse {
  isAuthenticated: boolean;
  role: UserRoleTypes | null;
  rolePriority: UserRolesPriorities;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  username: string;
  isActive: boolean;
}

export const transformUserResponse = (
  response: ServerUserInterface
): UserTransformationResponse => ({
  isAuthenticated: null,
  role: response?.group?.name || DEFAULT_AUTHORIZED_USER_ROLE,
  rolePriority: getUserPriorityByRole(response?.group?.name),
  firstName: response.firstname,
  lastName: response.lastname,
  address: response.address,
  phone: response.phone,
  email: response.email,
  isActive: response.is_active,
  username: response.username,
});

export interface LoginUserFormInterface {
  login: string;
  password1: string;
}

export interface ServerLoginUserFormInterface {
  username: string;
  password: string;
}

export interface ServerLoginUserResponseInterface {
  token: string;
}

export const transformLoginUserForm = ({
  login,
  password1,
}: LoginUserFormInterface): ServerLoginUserFormInterface => ({
  username: login,
  password: password1,
});
export interface PreResetPasswordRequestInterface {
  email: string;
}

export interface ResetPasswordRequestInterface {
  token: string;
  uidb64: string;
  new_password1: string;
  new_password2: string;
}

export const transformResetPasswordFormToRequest = ({
  uidb64,
  token,
  password1,
  password2,
}: ResetPasswordWithMetaInterface): ResetPasswordRequestInterface => ({
  token,
  uidb64,
  new_password1: password1,
  new_password2: password2,
});
