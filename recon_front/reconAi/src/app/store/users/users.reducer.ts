import { UserInterface } from './../../users/constants/types/user';
import {
  loadUsersListSucceededAction,
  loadUserProfileSucceededAction,
  resetUserProfileAction,
} from './users.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { UserProfileFormInterface } from 'app/constants/types';

export interface UsersState {
  list: UserInterface[];
  meta: {
    pageSize: number;
    currentPage: number;
    count: number;
  };
  user: UserProfileFormInterface;
}

export const initialState: UsersState = {
  list: [],
  meta: null,
  user: null,
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

const usersReducer = createReducer(
  initialState,
  on(loadUsersListSucceededAction, loadUsersListSucceededReducer),
  on(loadUserProfileSucceededAction, loadUserProfileSucceededReducer),
  on(resetUserProfileAction, resetUserProfileReducer)
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
