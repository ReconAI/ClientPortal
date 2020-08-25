import {
  PaginationRequestInterface,
  PaginationResponseServerInterface,
} from 'app/constants/types/requests';
import { UserProfileFormInterface } from './../../constants/types/user';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import {
  LoginUserFormInterface,
  UserTransformationResponse,
  PreResetPasswordRequestInterface,
  AttachCardRequestClientInterface,
  LoadCardsRequestClientInterface,
  DeleteUserCardRequestInterface,
  NewRequestFeatureClientInterface,
  SetDefaultPaymentMethodClientInterface,
} from './user.server.helpers';
import { createAction, props } from '@ngrx/store';
import { ResetPasswordWithMetaInterface } from 'app/constants/types/resetPassword';
import { PurchaseClientInterface } from 'app/constants/types/purchase';

export enum UserActionTypes {
  LOAD_CURRENT_USER_REQUESTED = '[User] Load Current User Requested',
  LOAD_CURRENT_USER_SUCCEEDED = '[User] Load Current User Succeeded',
  LOAD_CURRENT_USER_ERROR = '[User] Load Current User Error',
  RESET_CURRENT_USER = '[User] Reset Current User',

  LOGIN_USER_REQUESTED = '[User] Login User Requested',
  LOGIN_USER_SUCCEEDED = '[User] Login User Succeeded',
  LOGIN_USER_ERROR = '[User] Login User Error',
  RESET_LOGIN_USER_ERROR = '[User] Reset Login User Error',

  LOGOUT_USER_REQUESTED = '[User] Logout User Requested',
  LOGOUT_USER_SUCCEEDED = '[User] Logout User Succeeded',
  LOGOUT_USER_ERROR = '[User] Logout User Error',

  PRE_RESET_PASSWORD_REQUESTED = '[User] Pre Reset Password Requested',
  PRE_RESET_PASSWORD_SUCCEEDED = '[User] Pre Reset Password Succeeded',
  PRE_RESET_PASSWORD_ERROR = '[User] Pre Reset Password Error',
  PRE_RESET_RESET_PASSWORD_ERROR = '[User] Pre Reset Reset Password Error',

  RESET_PASSWORD_REQUESTED = '[User] Reset Password Requested',
  RESET_PASSWORD_SUCCEEDED = '[User] Reset Password Succeeded',
  RESET_PASSWORD_ERROR = '[User] Reset Password Error',
  RESET_RESET_PASSWORD_ERROR = '[User] Reset Reset Password Error',

  UPDATE_CURRENT_USER_REQUESTED = '[User] Update Current User Requested',
  UPDATE_CURRENT_USER_SUCCEEDED = '[User] Update Current User Succeeded',
  UPDATE_CURRENT_USER_ERROR = '[User] Update Current User Error',
  RESET_UPDATE_CURRENT_USER_ERROR = '[User] Reset Update Current User Error',

  ATTACH_CARD_REQUESTED = '[User] Attach Card Requested',
  ATTACH_CARD_SUCCEEDED = '[User] Attach Card Succeeded',
  ATTACH_CARD_ERROR = '[User] Attach Card Error',
  RESET_ATTACH_CARD_ERROR = '[User] Reset Attach Card Error',

  LOAD_USER_CARDS_REQUESTED = '[User] Load User Cards Requested',
  LOAD_USER_CARDS_SUCCEEDED = '[User] Load User Cards Succeeded',
  LOAD_USER_CARDS_ERROR = '[User] Load User Cards Error',

  DELETE_USER_CARD_REQUESTED = '[User] Delete User Card Requested',
  DELETE_USER_CARD_SUCCEEDED = '[User] Delete User Card Succeeded',
  DELETE_USER_CARD_ERROR = '[User] Delete User Card Error',

  UPDATE_BASKET_AMOUNT = '[User] Update Basket Amount',

  LOAD_PURCHASE_LIST_REQUESTED = '[User] Load Purchase List Requested',
  LOAD_PURCHASE_LIST_SUCCEEDED = '[User] Load Purchase List Succeeded',
  LOAD_PURCHASE_LIST_ERROR = '[User] Load Purchase List Error',

  NEW_REQUEST_FEATURE_REQUESTED = '[User] New Request Feature Requested',
  NEW_REQUEST_FEATURE_SUCCEEDED = '[User] New Request Feature Succeeded',
  NEW_REQUEST_FEATURE_ERROR = '[User] New Request Feature Error',
  RESET_NEW_REQUEST_FEATURE_ERROR = '[User] Reset New Request Feature Error',

  SET_DEFAULT_PAYMENT_METHOD_REQUESTED = '[User] Set Default Payment Method Requested',
  SET_DEFAULT_PAYMENT_METHOD_SUCCEEDED = '[User] Set Default Payment Method Succeeded',
  SET_DEFAULT_PAYMENT_METHOD_ERROR = '[User] Set Default Payment Method Error',

  SET_AUTH_STATUS = '[User] Set Auth Status',
}

export const loadCurrentUserRequestedAction = createAction(
  UserActionTypes.LOAD_CURRENT_USER_REQUESTED
);

export const loadCurrentUserSucceededAction = createAction(
  UserActionTypes.LOAD_CURRENT_USER_SUCCEEDED,
  props<UserTransformationResponse>()
);

export const loadCurrentUserErrorAction = createAction(
  UserActionTypes.LOAD_CURRENT_USER_ERROR
);

export const resetCurrentUserAction = createAction(
  UserActionTypes.RESET_CURRENT_USER
);

export const loginUserRequestedAction = createAction(
  UserActionTypes.LOGIN_USER_REQUESTED,
  props<LoginUserFormInterface>()
);

export const loginUserSucceededAction = createAction(
  UserActionTypes.LOGIN_USER_SUCCEEDED
);

export const loginUserErrorAction = createAction(
  UserActionTypes.LOGIN_USER_ERROR,
  props<FormServerErrorInterface>()
);

export const resetLoginUserErrorAction = createAction(
  UserActionTypes.RESET_LOGIN_USER_ERROR
);

export const logoutUserRequestedAction = createAction(
  UserActionTypes.LOGOUT_USER_REQUESTED
);

export const logoutUserSucceededAction = createAction(
  UserActionTypes.LOGOUT_USER_SUCCEEDED
);

export const logoutUserErrorAction = createAction(
  UserActionTypes.LOGOUT_USER_ERROR
);

export const preResetPasswordRequestedAction = createAction(
  UserActionTypes.PRE_RESET_PASSWORD_REQUESTED,
  props<PreResetPasswordRequestInterface>()
);

export const preResetPasswordSucceededAction = createAction(
  UserActionTypes.PRE_RESET_PASSWORD_SUCCEEDED
);

export const preResetPasswordErrorAction = createAction(
  UserActionTypes.PRE_RESET_PASSWORD_ERROR,
  props<FormServerErrorInterface>()
);

export const preResetResetPasswordErrorAction = createAction(
  UserActionTypes.PRE_RESET_RESET_PASSWORD_ERROR
);

export const resetPasswordRequestedAction = createAction(
  UserActionTypes.RESET_PASSWORD_REQUESTED,
  props<ResetPasswordWithMetaInterface>()
);

export const resetPasswordSucceededAction = createAction(
  UserActionTypes.RESET_PASSWORD_SUCCEEDED
);

export const resetPasswordErrorAction = createAction(
  UserActionTypes.RESET_PASSWORD_ERROR,
  props<FormServerErrorInterface>()
);

export const resetResetPasswordErrorAction = createAction(
  UserActionTypes.RESET_RESET_PASSWORD_ERROR
);

export const updateCurrentUserRequestedAction = createAction(
  UserActionTypes.UPDATE_CURRENT_USER_REQUESTED,
  props<UserProfileFormInterface>()
);

export const updateCurrentUserSucceededAction = createAction(
  UserActionTypes.UPDATE_CURRENT_USER_SUCCEEDED,
  props<UserProfileFormInterface>()
);

export const updateCurrentUserErrorAction = createAction(
  UserActionTypes.UPDATE_CURRENT_USER_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetUpdateCurrentUserErrorAction = createAction(
  UserActionTypes.RESET_UPDATE_CURRENT_USER_ERROR
);

export const attachCardRequestedAction = createAction(
  UserActionTypes.ATTACH_CARD_REQUESTED,
  props<AttachCardRequestClientInterface>()
);

export const attachCardSucceededAction = createAction(
  UserActionTypes.ATTACH_CARD_SUCCEEDED
);

export const attachCardErrorAction = createAction(
  UserActionTypes.ATTACH_CARD_ERROR,
  props<FormServerErrorInterface>()
);

export const resetAttachCardErrorAction = createAction(
  UserActionTypes.RESET_ATTACH_CARD_ERROR
);

export const loadUserCardsRequestedAction = createAction(
  UserActionTypes.LOAD_USER_CARDS_REQUESTED
);

export const loadUserCardsSucceededAction = createAction(
  UserActionTypes.LOAD_USER_CARDS_SUCCEEDED,
  props<LoadCardsRequestClientInterface>()
);

export const loadUserCardsErrorAction = createAction(
  UserActionTypes.LOAD_USER_CARDS_ERROR
);

export const deleteUserCardRequestedAction = createAction(
  UserActionTypes.DELETE_USER_CARD_REQUESTED,
  props<DeleteUserCardRequestInterface>()
);

export const deleteUserCardSucceededAction = createAction(
  UserActionTypes.DELETE_USER_CARD_SUCCEEDED
);

export const deleteUserCardErrorAction = createAction(
  UserActionTypes.DELETE_USER_CARD_ERROR
);

export interface UpdateBasketActionPayload {
  amount: number;
}

export const updateBasketAmountAction = createAction(
  UserActionTypes.UPDATE_BASKET_AMOUNT,
  props<UpdateBasketActionPayload>()
);

// new request feature
export const newRequestFeatureRequestedAction = createAction(
  UserActionTypes.NEW_REQUEST_FEATURE_REQUESTED,
  props<NewRequestFeatureClientInterface>()
);

export const newRequestFeatureSucceededAction = createAction(
  UserActionTypes.NEW_REQUEST_FEATURE_SUCCEEDED
);

export const newRequestFeatureErrorAction = createAction(
  UserActionTypes.NEW_REQUEST_FEATURE_ERROR,
  props<FormServerErrorInterface>()
);

export const resetNewRequestFeatureErrorAction = createAction(
  UserActionTypes.RESET_NEW_REQUEST_FEATURE_ERROR
);

// default payment method
export const setDefaultPaymentMethodRequestedAction = createAction(
  UserActionTypes.SET_DEFAULT_PAYMENT_METHOD_REQUESTED,
  props<SetDefaultPaymentMethodClientInterface>()
);

export const setDefaultPaymentMethodSucceededAction = createAction(
  UserActionTypes.SET_DEFAULT_PAYMENT_METHOD_SUCCEEDED,
  props<SetDefaultPaymentMethodClientInterface>()
);

export const setDefaultPaymentMethodErrorAction = createAction(
  UserActionTypes.SET_DEFAULT_PAYMENT_METHOD_ERROR
);

export interface SetAuthActionPayloadInterface {
  status: boolean;
}

export const setAuthStatusAction = createAction(
  UserActionTypes.SET_AUTH_STATUS,
  props<SetAuthActionPayloadInterface>()
);
