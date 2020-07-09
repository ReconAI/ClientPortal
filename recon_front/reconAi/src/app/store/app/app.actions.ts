import { createAction, props } from '@ngrx/store';

export enum AppActionTypes {
  SET_TITLE = '[App] Set Title',
}

export interface AppTitleActionInterface {
  title: string;
}

export const setAppTitleAction = createAction(
  AppActionTypes.SET_TITLE,
  props<AppTitleActionInterface>()
);
