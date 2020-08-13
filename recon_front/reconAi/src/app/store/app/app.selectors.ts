import { AppSliceState } from './app.reducer';
import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { BreadcrumbInterface } from 'app/constants/routes';

export const selectAppSlice = (state: AppState): AppSliceState => state.app;

export const selectAppTitle = createSelector(
  selectAppSlice,
  (app: AppSliceState): string => app.title
);

export const selectBreadcrumbs = createSelector(
  selectAppSlice,
  (app: AppSliceState): BreadcrumbInterface[] => app.breadcrumbs
);

export const selectBreadcrumbsVisibility = createSelector(
  selectAppSlice,
  (app: AppSliceState): boolean => app.breadcrumbsVisibility
);
