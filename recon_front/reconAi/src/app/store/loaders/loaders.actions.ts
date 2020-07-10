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
  SET_USER_LIST_LOADING_STATUS = '[Loaders] Set User List Loading Status',
  SET_USER_PROFILE_LOADING_STATUS = '[Loaders] Set User Profile Loading Status',
  SET_DELETE_USER_LOADING_STATUS = '[Loaders] Set Delete User Loading Status',
  SET_ADD_USER_LOADING_STATUS = '[Loaders] Set Add User Loading Status',
  SET_INVITE_USER_LOADING_STATUS = '[Loaders] Set Invite User Loading Status',
  SET_INVITE_SIGN_UP_USER_LOADING_STATUS = '[Loaders] Set Invite Sign Up User Loading Status',
  SET_UPDATE_CURRENT_USER_LOADING_STATUS = '[Loaders] Set Update Current User Loading Status',
  SET_UPDATE_USER_LOADING_STATUS = '[Loaders] Set Update User Loading Status',
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

export const setUserProfileLoadingStatusAction = createAction(
  LoadersActionTypes.SET_USER_PROFILE_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setDeleteUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_DELETE_USER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setAddUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_ADD_USER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setInviteUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_INVITE_USER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setInviteSignUpUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_INVITE_SIGN_UP_USER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setUpdateCurrentUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_UPDATE_CURRENT_USER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setUpdateUserLoadingStatusAction = createAction(
  LoadersActionTypes.SET_UPDATE_USER_LOADING_STATUS,
  props<LoaderInterface>()
);
