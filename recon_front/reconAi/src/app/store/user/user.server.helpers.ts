import { ResetPasswordWithMetaInterface } from 'app/constants/types/resetPassword';
import { getUserPriorityByRole } from './../../core/helpers/priorities';
import { FormServerErrorInterface } from './../../constants/types/requests';
import { UserRolesPriorities } from 'app/constants/types';
import {
  DEFAULT_USER_ROLE,
  DEFAULT_USER_ROLE_PRIORITY,
  UserRoleTypes,
} from './../../constants/types/user';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserResponse {
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
  response: UserResponse
): UserTransformationResponse => ({
  isAuthenticated: null,
  role: response?.group?.name || DEFAULT_USER_ROLE,
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
export const transformErrorsToDisplay = (
  error: HttpErrorResponse
): FormServerErrorInterface | null => {
  const errors = error?.error?.errors;

  if (error.status === 400 || error.status === 422) {
    if (errors) {
      if (errors.non_field_errors) {
        return {
          general: errors.non_field_errors.join(' '),
        };
      }
    }
  }

  return null;
};

export interface PreResetPasswordRequestInterface {
  email: string;
}

export interface ResetPasswordReqestInterface {
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
}: ResetPasswordWithMetaInterface): ResetPasswordReqestInterface => ({
  token,
  uidb64,
  new_password1: password1,
  new_password2: password2,
});
