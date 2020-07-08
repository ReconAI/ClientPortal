import {
  UsersListRequestInterface,
  StoreUsersListInterface,
  UserProfileRequestInterface,
} from './users.server.helpers';
import { createAction, props } from '@ngrx/store';
import { UserProfileFormInterface } from 'app/constants/types';
import { AddUserInterface } from 'app/users/constants';
import { FormServerErrorInterface } from 'app/constants/types/requests';
export enum UsersActionTypes {
  LOAD_USERS_LIST_REQUESTED = '[Users] Load Users Requested',
  LOAD_USERS_LIST_SUCCEEDED = '[Users] Load Users Succeeded',
  LOAD_USERS_LIST_ERROR = '[Users] Load Users Error',

  LOAD_USER_PROFILE_REQUESTED = '[Users] Load User Profile Requested',
  LOAD_USER_PROFILE_SUCCEEDED = '[Users] Load User Profile Succeeded',
  LOAD_USER_PROFILE_ERROR = '[Users] Load User Profile Error',
  RESET_USER_PROFILE = '[Users] Reset User Profile',

  DELETE_USER_REQUESTED = '[Users] Delete User Requested',
  DELETE_USER_SUCCEEDED = '[Users] Delete User Succeeded',
  DELETE_USER_ERROR = '[Users] Delete User Error',

  ADD_USER_REQUESTED = '[Users] Add User Requested',
  ADD_USER_SUCCEEDED = '[Users] Add User Succeeded',
  ADD_USER_ERROR = '[Users] Add User Error',
  RESET_ADD_USER_ERROR = '[Users] Reset Add User Error',
}

export const loadUsersListRequestedAction = createAction(
  UsersActionTypes.LOAD_USERS_LIST_REQUESTED,
  props<UsersListRequestInterface>()
);

export const loadUsersListSucceededAction = createAction(
  UsersActionTypes.LOAD_USERS_LIST_SUCCEEDED,
  props<StoreUsersListInterface>()
);

export const loadUsersListErrorAction = createAction(
  UsersActionTypes.LOAD_USERS_LIST_ERROR
);

export const loadUserProfileRequestedAction = createAction(
  UsersActionTypes.LOAD_USER_PROFILE_REQUESTED,
  props<UserProfileRequestInterface>()
);

export const loadUserProfileSucceededAction = createAction(
  UsersActionTypes.LOAD_USER_PROFILE_SUCCEEDED,
  props<UserProfileFormInterface>()
);

export const loadUserProfileErrorAction = createAction(
  UsersActionTypes.LOAD_USER_PROFILE_ERROR
);

export const resetUserProfileAction = createAction(
  UsersActionTypes.LOAD_USER_PROFILE_ERROR
);

export const deleteUserRequestedAction = createAction(
  UsersActionTypes.DELETE_USER_REQUESTED,
  props<UserProfileRequestInterface>()
);

export const deleteUserSucceededAction = createAction(
  UsersActionTypes.DELETE_USER_SUCCEEDED
);

export const deleteUserErrorAction = createAction(
  UsersActionTypes.DELETE_USER_ERROR
);

export const addUserRequestedAction = createAction(
  UsersActionTypes.ADD_USER_REQUESTED,
  props<AddUserInterface>()
);

export const addUserSucceededAction = createAction(
  UsersActionTypes.ADD_USER_SUCCEEDED
);

export const addUserErrorAction = createAction(
  UsersActionTypes.ADD_USER_ERROR,
  props<FormServerErrorInterface>()
);

export const resetAddUserErrorAction = createAction(
  UsersActionTypes.RESET_ADD_USER_ERROR
);
