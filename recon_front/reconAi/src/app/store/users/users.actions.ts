import { UsersListRequestInterface,  StoreUsersListInterface, UserProfileRequestInterface } from './users.server.helpers';
import { createAction, props } from '@ngrx/store';
import { UserProfileFormInterface } from 'app/constants/types';
export enum UsersActionTypes {
  LOAD_USERS_LIST_REQUESTED = '[Users] Load Users Requested',
  LOAD_USERS_LIST_SUCCEEDED = '[Users] Load Users Succeeded',
  LOAD_USERS_LIST_ERROR = '[Users] Load Users Error',

  LOAD_USER_PROFILE_REQUESTED = '[Users] Load User Profile Requested',
  LOAD_USER_PROFILE_SUCCEEDED = '[Users] Load User Profile Succeeded',
  LOAD_USER_PROFILE_ERROR = '[Users] Load User Profile Error',
  RESET_USER_PROFILE = '[Users] Reset User Profile',
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
  UsersActionTypes.LOAD_USER_PROFILE_ERROR,
);

export const resetUserProfileAction = createAction(
  UsersActionTypes.LOAD_USER_PROFILE_ERROR,
);
