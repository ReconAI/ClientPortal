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
  SET_CATEGORIES_LIST_LOADING_STATUS = '[Loaders | Orders] Set Categories List Loading Status',
  SET_ALL_CATEGORIES_LIST_LOADING_STATUS = '[Loaders | Orders] Set All Categories List Loading Status',
  SET_UPDATE_CATEGORIES_LIST_LOADING_STATUS = '[Loaders | Orders] Set Update Categories List Loading Status',
  SET_CREATE_MANUFACTURER_LOADING_STATUS = '[Loaders | Orders] Set Create Manufacturer Loading Status',
  SET_MANUFACTURER_LIST_LOADING_STATUS = '[Loaders | Orders] Set Manufacturer List Loading Status',
  SET_CREATE_DEVICE_LOADING_STATUS = '[Loaders | Orders] Set Create Device Loading Status',
  SET_DEVICE_LIST_LOADING_STATUS = '[Loaders | Orders] Set Device List Loading Status',
  SET_DELETE_DEVICE_LOADING_STATUS = '[Loaders | Orders] Set Delete Device Loading Status',
  SET_MANAGEMENT_DEVICE_LOADING_STATUS = '[Loaders | Orders] Set Management Device Loading Status',
  SET_UPDATE_DEVICE_LOADING_STATUS = '[Loaders | Orders] Set Update Device Loading Status',
  SET_DEVICE_LOADING_STATUS = '[Loaders | Orders] Set Device Loading Status',
  SET_ATTACH_CARD_LOADING_STATUS = '[Loaders | User] Set Attach Card Loading Status',
  SET_DETACH_CARD_LOADING_STATUS = '[Loaders | User] Set Detach Card Loading Status',
  SET_USER_CARDS_LOADING_STATUS = '[Loaders | User] Set User Cards Loading Status',
  SET_BASKET_OVERVIEW_LOADING_STATUS = '[Loaders | Orders] Set Basket Overview Loading Status',
  SET_PAY_BASKET_LOADING_STATUS = '[Loaders | Orders] Set Pay Basket Loading Status',
  SET_PURCHASE_LIST_LOADING_STATUS = '[Loaders | Purchases] Set Purchase List Loading Status',
  SET_PURCHASE_LOADING_STATUS = '[Loaders | Purchases] Set Purchase Loading Status',
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

// orders
export const setCategoriesListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_CATEGORIES_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setAllCategoriesListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_ALL_CATEGORIES_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setUpdateCategoriesListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_UPDATE_CATEGORIES_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setCreateManufacturerLoadingStatusAction = createAction(
  LoadersActionTypes.SET_CREATE_MANUFACTURER_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setManufacturerListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_MANUFACTURER_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setCreateDeviceLoadingStatusAction = createAction(
  LoadersActionTypes.SET_CREATE_DEVICE_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setDeviceListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_DEVICE_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setDeleteDeviceLoadingStatusAction = createAction(
  LoadersActionTypes.SET_DELETE_DEVICE_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setManagementDeviceLoadingStatusAction = createAction(
  LoadersActionTypes.SET_MANAGEMENT_DEVICE_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setDeviceLoadingStatusAction = createAction(
  LoadersActionTypes.SET_DEVICE_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setUpdateDeviceLoadingStatusAction = createAction(
  LoadersActionTypes.SET_UPDATE_DEVICE_LOADING_STATUS,
  props<LoaderInterface>()
);

// user -> cards
export const setAttachCardLoadingStatusAction = createAction(
  LoadersActionTypes.SET_ATTACH_CARD_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setDetachCardLoadingStatusAction = createAction(
  LoadersActionTypes.SET_DETACH_CARD_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setUserCardsLoadingStatusAction = createAction(
  LoadersActionTypes.SET_USER_CARDS_LOADING_STATUS,
  props<LoaderInterface>()
);
// end

// orders -> basket
export const setBasketOverviewLoadingStatusAction = createAction(
  LoadersActionTypes.SET_BASKET_OVERVIEW_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setPayBasketLoadingStatusAction = createAction(
  LoadersActionTypes.SET_PAY_BASKET_LOADING_STATUS,
  props<LoaderInterface>()
);

// purchases
export const setPurchaseListLoadingStatusAction = createAction(
  LoadersActionTypes.SET_PURCHASE_LIST_LOADING_STATUS,
  props<LoaderInterface>()
);

export const setPurchaseLoadingStatusAction = createAction(
  LoadersActionTypes.SET_PURCHASE_LOADING_STATUS,
  props<LoaderInterface>()
);
