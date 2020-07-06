import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { UsersState } from './users.reducer';
import { UserInterface } from '../../users/constants/types';

export const selectUsers = (state: AppState): UsersState => state.users;

export const selectUsersList = createSelector(
  selectUsers,
  (users: UsersState): UserInterface[] => users.list
);

export const selectUsersMetaPageSize = createSelector(
  selectUsers,
  (users: UsersState): number => users.meta?.pageSize || 0
);

export const selectUsersMetaTotalCount = createSelector(
  selectUsers,
  (users: UsersState): number => users.meta?.count || 0
);

export const selectUsersMetaCurrentPage = createSelector(
  selectUsers,
  (users: UsersState): number => users.meta?.currentPage || 0
);
