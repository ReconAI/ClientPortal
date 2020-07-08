import { UserState } from './../user/user.reducer';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { UserInterface } from './../../users/constants/types/user';
import {
  loadUsersListSucceededAction,
  loadUserProfileSucceededAction,
  resetUserProfileAction,
  addUserErrorAction,
  resetAddUserErrorAction,
} from './users.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { UserProfileFormInterface } from 'app/constants/types';

export interface UsersErrors {
  addUser: string;
}

const initErrors = {
  addUser: null,
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
}

export const initialState: UsersState = {
  list: [],
  meta: null,
  user: null,
  errors: initErrors,
};

const loadUsersListSucceededReducer = (
  state: UsersState,
  { type, ...payload }: Action & UserInterface // check it out
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

const usersReducer = createReducer(
  initialState,
  on(loadUsersListSucceededAction, loadUsersListSucceededReducer),
  on(loadUserProfileSucceededAction, loadUserProfileSucceededReducer),
  on(resetUserProfileAction, resetUserProfileReducer),
  on(addUserErrorAction, addUserErrorReducer),
  on(resetAddUserErrorAction, resetUserErrorReducer)
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
