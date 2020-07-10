import { AppSliceState } from './app.reducer';
import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';

export const selectAppSlice = (state: AppState): AppSliceState => state.app;

export const selectAppTitle = createSelector(
  selectAppSlice,
  (app: AppSliceState): string => app.title
);
