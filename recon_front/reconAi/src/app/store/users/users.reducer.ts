import { ActivationInterface } from './../../constants/types/activation';
import { UserState } from './../user/user.reducer';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from 'app/constants/types/requests';
import { UserInterface } from './../../users/constants/types/user';
import {
  loadUsersListSucceededAction,
  loadUserProfileSucceededAction,
  resetUserProfileAction,
  addUserErrorAction,
  resetAddUserErrorAction,
  inviteUserSucceededAction,
  inviteUserActivationSucceededAction,
  resetInvitationSignUpErrorAction,
  invitationSignUpErrorAction,
} from './users.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { UserProfileFormInterface } from 'app/constants/types';
import { UserTransformationResponse } from '../user/user.server.helpers';

export interface UsersErrors {
  addUser: string;
  inviteUserSignUp: FormServerErrorInterface;
}

const initErrors = {
  addUser: null,
  inviteUserSignUp: null,
};

export interface UsersState {
  list: UserInterface[];
  meta: {
    pageSize: number;
    currentPage: number;
    count: number;
  };
  user: UserProfileFormInterface;
  errors: UsersErrors;
  invitedUser: UserTransformationResponse;
  inviteActivation: ActivationInterface;
}

export const initialState: UsersState = {
  list: [],
  meta: null,
  user: null,
  invitedUser: null,
  inviteActivation: null,
  errors: initErrors,
};

const loadUsersListSucceededReducer = (
  state: UsersState,
  { type, ...payload }: Action & UserInterface
): UsersState => ({ ...state, ...payload });

const loadUserProfileSucceededReducer = (
  state: UsersState,
  { type, ...payload }: Action & UserProfileFormInterface
): UsersState => ({ ...state, user: payload });

const resetUserProfileReducer = (state: UsersState): UsersState => ({
  ...state,
  user: null,
});

const addUserErrorReducer = (
  state: UsersState,
  { type, general }: FormServerErrorInterface & Action
): UsersState => ({
  ...state,
  errors: {
    ...state.errors,
    addUser: general,
  },
});

const resetUserErrorReducer = (state: UsersState): UsersState => ({
  ...state,
  errors: {
    ...state.errors,
    addUser: initErrors.addUser,
  },
});

const inviteUserSucceededReducer = (
  state: UsersState,
  { type, isAuthenticated, ...user }: UserTransformationResponse & Action
): UsersState => ({
  ...state,
  invitedUser: user,
});

const inviteUserActivationSucceededReducer = (
  state: UsersState,
  { type, ...activation }: ActivationInterface & Action
): UsersState => ({
  ...state,
  inviteActivation: activation,
});

const invitationSignUpErrorReducer = (
  state: UsersState,
  { type, errors }: ObjectFormErrorInterface & Action
): UsersState => ({
  ...state,
  errors: {
    ...state.errors,
    inviteUserSignUp: errors,
  },
});

const resetInvitationSignUpErrorReducer = (state: UsersState): UsersState => ({
  ...state,
  errors: {
    ...state.errors,
    inviteUserSignUp: initErrors.inviteUserSignUp,
  },
});

const usersReducer = createReducer(
  initialState,
  on(loadUsersListSucceededAction, loadUsersListSucceededReducer),
  on(loadUserProfileSucceededAction, loadUserProfileSucceededReducer),
  on(resetUserProfileAction, resetUserProfileReducer),
  on(addUserErrorAction, addUserErrorReducer),
  on(resetAddUserErrorAction, resetUserErrorReducer),
  on(inviteUserSucceededAction, inviteUserSucceededReducer),
  on(inviteUserActivationSucceededAction, inviteUserActivationSucceededReducer),
  on(resetInvitationSignUpErrorAction, resetInvitationSignUpErrorReducer),
  on(invitationSignUpErrorAction, invitationSignUpErrorReducer)
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
