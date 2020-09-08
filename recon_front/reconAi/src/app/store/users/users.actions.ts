import { TrialEndDateClientInterface } from './../signUp/signUp.server.helpers';
import { UserTransformationResponse } from './../user/user.server.helpers';
import { ActivationInterface } from './../../constants/types/activation';
import {
  StoreUsersListInterface,
  UserProfileRequestInterface,
} from './users.server.helpers';
import { createAction, props } from '@ngrx/store';
import {
  UserProfileFormInterface,
  UserProfileFormUserInterface,
  CredentialsRequestInterface,
} from 'app/constants/types';
import { AddUserInterface } from 'app/users/constants';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
  PaginationRequestInterface,
} from 'app/constants/types/requests';

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

  INVITE_USER_REQUESTED = '[Users] Invite User Requested',
  INVITE_USER_SUCCEEDED = '[Users] Invite User Succeeded',
  INVITE_USER_ACTIVATION_SUCCEEDED = '[Users] Invite User Activation Succeeded',
  INVITE_USER_ERROR = '[Users] Invite User Error',

  INVITATION_SIGN_UP_REQUESTED = '[Users] Invitation Sign Up Requested',
  INVITATION_SIGN_UP_SUCCEEDED = '[Users] Invitation Sign Up Succeeded',
  INVITATION_SIGN_UP_ERROR = '[Users] Invitation Sign Up Error',
  RESET_INVITATION_SIGN_UP_ERROR = '[Users] Reset Invitation Sign Up Error',

  UPDATE_USER_REQUESTED = '[Users] Update User Requested',
  UPDATE_USER_SUCCEEDED = '[Users] Update User Succeeded',
  UPDATE_USER_ERROR = '[Users] Update User Error',
}

export const loadUsersListRequestedAction = createAction(
  UsersActionTypes.LOAD_USERS_LIST_REQUESTED,
  props<PaginationRequestInterface>()
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

export const inviteUserRequestedAction = createAction(
  UsersActionTypes.INVITE_USER_REQUESTED,
  props<ActivationInterface>()
);

export const inviteUserSucceededAction = createAction(
  UsersActionTypes.INVITE_USER_SUCCEEDED,
  props<UserProfileFormInterface>()
);

export const inviteUserErrorAction = createAction(
  UsersActionTypes.INVITE_USER_ERROR
);

export const inviteUserActivationSucceededAction = createAction(
  UsersActionTypes.INVITE_USER_ACTIVATION_SUCCEEDED,
  props<ActivationInterface>()
);

export const invitationSignUpRequestedAction = createAction(
  UsersActionTypes.INVITATION_SIGN_UP_REQUESTED,
  props<UserProfileFormInterface>()
);

export const invitationSignUpSucceededAction = createAction(
  UsersActionTypes.INVITATION_SIGN_UP_SUCCEEDED
);

export const invitationSignUpErrorAction = createAction(
  UsersActionTypes.INVITATION_SIGN_UP_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetInvitationSignUpErrorAction = createAction(
  UsersActionTypes.RESET_INVITATION_SIGN_UP_ERROR
);

// update user
export const updateUserRequested = createAction(
  UsersActionTypes.UPDATE_USER_REQUESTED,
  props<UserProfileFormUserInterface>()
);

export const updateUserSucceeded = createAction(
  UsersActionTypes.UPDATE_USER_SUCCEEDED
);

export const updateUserError = createAction(UsersActionTypes.UPDATE_USER_ERROR);
