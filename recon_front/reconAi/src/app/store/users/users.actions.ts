import { UsersListRequestInterface } from './users.server.helpers';
import { createAction, props } from '@ngrx/store';
export enum UsersActionTypes {
  LOAD_USERS_LIST_REQUESTED = '[Users] Load Users Requested',
  LOAD_USERS_LIST_SUCCEEDED = '[Users] Load Users Succeeded',
  LOAD_USERS_LIST_ERROR = '[Users] Load Users Error',
}

export const loadUsersListRequested = createAction(
  UsersActionTypes.LOAD_USERS_LIST_REQUESTED,
  props<UsersListRequestInterface>()
);
