import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState): UserState => state.user;

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user: UserState): boolean | null => user.isAuthenticated
);

export const selectIsNotAuthenticated = createSelector(
  selectUser,
  (user: UserState): boolean | null =>
    user.isAuthenticated === null ? null : !user.isAuthenticated
);

export const selectUserRole = createSelector(
  selectUser,
  (user: UserState): UserRoleTypes | null => user.role
);

export const selectUserRolePriority = createSelector(
  selectUser,
  (user: UserState): UserRolesPriorities | null => user.rolePriority
);

export const selectLoginErrorsStatus = createSelector(
  selectUser,
  (user: UserState): string => user.errors?.login || ''
);

export const selectCurrentUserName = createSelector(
  selectUser,
  (user: UserState): string => user.username || ''
);

export const selectPreResetPasswordError = createSelector(
  selectUser,
  (user: UserState): string => user.errors?.preResetPassword || ''
);

export const selectResetPasswordError = createSelector(
  selectUser,
  (user: UserState): string => user.errors?.resetPassword || ''
);
