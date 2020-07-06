import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { UsersState } from './users.reducer';

export const selectUsers = (state: AppState): UsersState => state.users;
