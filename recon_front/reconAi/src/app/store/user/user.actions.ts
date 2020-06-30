import { FormServerErrorInterface } from './../../constants/types/requests';
import {
  LoginUserFormInterface,
  UserTransformationResponse,
  PreResetPasswordRequestInterface,
} from './user.server.helpers';
import { createAction, props } from '@ngrx/store';
import { ResetPasswordWithMetaInterface } from 'app/constants/types/resetPassword';

export enum UserActionTypes {
  LOAD_CURRENT_USER_REQUESTED = '[User] Load Current User Requested',
  LOAD_CURRENT_USER_SUCCEEDED = '[User] Load Current User Succeeded',
  LOAD_CURRENT_USER_ERROR = '[User] Load Current User Error',
  RESET_CURRENT_USER = '[User] Reset Current User',

  LOGIN_USER_REQUESTED = '[User] Login User Requested',
  LOGIN_USER_SUCCEEDED = '[User] Login User Succeeded',
  LOGIN_USER_ERROR = '[User] Login User Error',
  RESET_LOGIN_USER_ERROR = '[User] Reset Login User Error',

  LOGOUT_USER_REQUESTED = '[User] Logout User Requested',
  LOGOUT_USER_SUCCEEDED = '[User] Logout User Succeeded',
  LOGOUT_USER_ERROR = '[User] Logout User Error',

  PRE_RESET_PASSWORD_REQUESTED = '[User] Pre Reset Password Requested',
  PRE_RESET_PASSWORD_SUCCEEDED = '[User] Pre Reset Password Succeeded',
  PRE_RESET_PASSWORD_ERROR = '[User] Pre Reset Password Error',
  PRE_RESET_RESET_PASSWORD_ERROR = '[User] Pre Reset Reset Password Error',

  RESET_PASSWORD_REQUESTED = '[User] Reset Password Requested',
  RESET_PASSWORD_SUCCEEDED = '[User] Reset Password Succeeded',
  RESET_PASSWORD_ERROR = '[User] Reset Password Error',
  RESET_RESET_PASSWORD_ERROR = '[User] Reset Reset Password Error',
}

export const loadCurrentUserRequestedAction = createAction(
  UserActionTypes.LOAD_CURRENT_USER_REQUESTED
);

export const loadCurrentUserSucceededAction = createAction(
  UserActionTypes.LOAD_CURRENT_USER_SUCCEEDED,
  props<UserTransformationResponse>()
);

export const loadCurrentUserErrorAction = createAction(
  UserActionTypes.LOAD_CURRENT_USER_ERROR
);

export const resetCurrentUserAction = createAction(
  UserActionTypes.RESET_CURRENT_USER
);

export const loginUserRequestedAction = createAction(
  UserActionTypes.LOGIN_USER_REQUESTED,
  props<LoginUserFormInterface>()
);

export const loginUserSucceededAction = createAction(
  UserActionTypes.LOGIN_USER_SUCCEEDED
);

export const loginUserErrorAction = createAction(
  UserActionTypes.LOGIN_USER_ERROR,
  props<FormServerErrorInterface>()
);

export const resetLoginUserErrorAction = createAction(
  UserActionTypes.RESET_LOGIN_USER_ERROR
);

export const logoutUserRequestedAction = createAction(
  UserActionTypes.LOGOUT_USER_REQUESTED
);

export const logoutUserSucceededAction = createAction(
  UserActionTypes.LOGOUT_USER_SUCCEEDED
);

export const logoutUserErrorAction = createAction(
  UserActionTypes.LOGOUT_USER_ERROR
);

export const preResetPasswordRequestedAction = createAction(
  UserActionTypes.PRE_RESET_PASSWORD_REQUESTED,
  props<PreResetPasswordRequestInterface>()
);

export const preResetPasswordSucceededAction = createAction(
  UserActionTypes.PRE_RESET_PASSWORD_SUCCEEDED
);

export const preResetPasswordErrorAction = createAction(
  UserActionTypes.PRE_RESET_PASSWORD_ERROR,
  props<FormServerErrorInterface>()
);

export const preResetResetPasswordErrorAction = createAction(
  UserActionTypes.PRE_RESET_RESET_PASSWORD_ERROR
);

export const resetPasswordRequestedAction = createAction(
  UserActionTypes.RESET_PASSWORD_REQUESTED,
  props<ResetPasswordWithMetaInterface>()
);

export const resetPasswordSucceededAction = createAction(
  UserActionTypes.RESET_PASSWORD_SUCCEEDED
);

export const resetPasswordErrorAction = createAction(
  UserActionTypes.RESET_PASSWORD_ERROR,
  props<FormServerErrorInterface>()
);

export const resetResetPasswordErrorAction = createAction(
  UserActionTypes.RESET_RESET_PASSWORD_ERROR
);
