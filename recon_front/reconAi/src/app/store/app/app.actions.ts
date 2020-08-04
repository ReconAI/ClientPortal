import { createAction, props } from '@ngrx/store';
import { BreadcrumbInterface } from 'app/constants/routes';

export enum AppActionTypes {
  SET_TITLE = '[App] Set Title',
  SET_BREADCRUMBS = '[App] Set Breadcrumbs',
  UPDATE_BREADCRUMB_BY_LABEL = '[App] Update Breadcrumb By Label',
  INSERT_BREADCRUMB_AT_INDEX = '[App] Insert Breadcrumb At Index',
  SET_BREADCRUMBS_VISIBILITY = '[App] Set Breadcrumbs Visibility'
}

export interface AppTitleActionInterface {
  title: string;
}
export interface SetBreadCrumbsActionInterface {
  breadcrumbs: BreadcrumbInterface[];
}
export interface UpdateBreadcrumbByIdActionInterface {
  update: {
    // should start with %
    oldId: string;
    newLabel: string;
    newUrl: string;
  };
}

export interface InsertBreadcrumbAtIndexActionInterface {
  insert: BreadcrumbInterface & {
    index: number;
  };
}

export interface SetBreadcrumbsVisibilityActionInterface {
  visibility: boolean;
}

export const setAppTitleAction = createAction(
  AppActionTypes.SET_TITLE,
  props<AppTitleActionInterface>()
);

export const updateBreadcrumbByIdAction = createAction(
  AppActionTypes.UPDATE_BREADCRUMB_BY_LABEL,
  props<UpdateBreadcrumbByIdActionInterface>()
);

export const setBreadcrumbsAction = createAction(
  AppActionTypes.SET_BREADCRUMBS,
  props<SetBreadCrumbsActionInterface>()
);

export const insertBreadcrumbAtIndexAction = createAction(
  AppActionTypes.INSERT_BREADCRUMB_AT_INDEX,
  props<InsertBreadcrumbAtIndexActionInterface>()
);

export const setBreadcrumbsVisibilityAction = createAction(
  AppActionTypes.SET_BREADCRUMBS_VISIBILITY,
  props<SetBreadcrumbsVisibilityActionInterface>()
);
