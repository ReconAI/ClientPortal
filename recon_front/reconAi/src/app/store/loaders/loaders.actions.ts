import { createAction, props } from '@ngrx/store';

export enum LoadersActionTypes {
  // global loading status is used for loader covering entire application
  SET_GLOBAL_LOADING_STATUS = '[Loaders] Set Global Loading Status',
  SET_CURRENT_USER_LOADING_STATUS = '[Loaders] Set Current User Loading Status',
  SET_LOGIN_LOADING_STATUS = '[Loaders] Set Login Loading Status',
  SET_LOGOUT_LOADING_STATUS = '[Loaders] Set Logout Loading Status',
  SET_PRE_SIGN_UP_LOADING_STATUS = '[Loaders] Set Pre Sign Up Loading Status',
  SET_SIGN_UP_LOADING_STATUS = '[Loaders] Set Sign Up Loading Status',
  SET_ACTIVATION_LOADING_STATUS = '[Loaders] Set Activation Loading Status',
  SET_PRE_RESET_PASSWORD_LOADING_STATUS = '[Loaders] Set Pre Reset Password Loading Status',
  SET_RESET_PASSWORD_LOADING_STATUS = '[Loaders] Set Reset Password Loading Status',
  SET_USER_LIST_LOADING_STATUS = '[Loaders] Set User Loading Status',
}

export interface LoaderInterface {
  status: boolean;
}

export const setGlobalLoadingStatusAction = createAction(
  LoadersActionTypes.SET_GLOBAL_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setCurrentUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_CURRENT_USER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setLoginLoadingStatusAction = createAction(
  LoadersActionTypes.SET_LOGIN_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setLogoutLoadingStatusAction = createAction(
  LoadersActionTypes.SET_LOGOUT_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setPreSignUpLoadingStatusAction = createAction(
  LoadersActionTypes.SET_PRE_SIGN_UP_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setSignUpLoadingStatusAction = createAction(
  LoadersActionTypes.SET_SIGN_UP_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setActivationLoadingStatusAction = createAction(
  LoadersActionTypes.SET_ACTIVATION_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setPreResetPasswordLoadingStatusAction = createAction(
  LoadersActionTypes.SET_PRE_RESET_PASSWORD_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setResetPasswordLoadingStatusAction = createAction(
  LoadersActionTypes.SET_RESET_PASSWORD_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setUserListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_USER_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);
