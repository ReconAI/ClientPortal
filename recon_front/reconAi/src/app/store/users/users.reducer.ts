import { UserInterface } from './../../users/constants/types/user';
import { loadUsersListSucceededAction } from './users.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface UsersState {
  list: UserInterface[];
  meta: {
    pageSize: number;
    currentPage: number;
    count: number;
  };
}

export const initialState: UsersState = {
  list: [],
  meta: null,
};

const loadUsersListSucceededReducer = (
  state: UsersState,
  { type, ...payload }: Action & UserInterface
): UsersState => ({ ...state, ...payload });

const usersReducer = createReducer(
  initialState,
  on(loadUsersListSucceededAction, loadUsersListSucceededReducer)
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
