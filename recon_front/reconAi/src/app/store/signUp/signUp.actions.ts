import { ActivationInterface } from './../../constants/types/activation';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import {
  PreSignUpInterface,
  TrialEndDateClientInterface,
} from './signUp.server.helpers';
import { SignUpState } from './signUp.reducer';
import { createAction, props } from '@ngrx/store';
import { UserProfileFormInterface } from 'app/constants/types';

export enum SignUpActionTypes {
  SIGN_UP_USER_REQUESTED = '[Sign Up] Sign Up User Requested',
  SIGN_UP_USER_SUCCEEDED = '[Sign Up] Sign Up User Succeeded',
  SIGN_UP_USER_ERROR = '[Sign Up] Sign Up User Error',
  RESET_SIGN_UP_USER_ERROR = '[Sign Up] Reset Sign Up User Error',

  SET_PRE_SIGN_UP_INFO = '[Sign Up] Set Pre Sign Up Info',
  PRE_SIGN_UP_USER_REQUESTED = '[Sign Up] Pre Sign Up User Requested',
  PRE_SIGN_UP_USER_SUCCEEDED = '[Sign Up] Pre Sign Up User Succeeded',
  PRE_SIGN_UP_USER_ERROR = '[Sign Up] Pre Sign Up User Error',
  RESET_PRE_SIGN_UP_USER_ERROR = '[Sign Up] Reset Pre Sign Up User Error',

  ACTIVATION_REQUESTED = '[Sign Up] Activation Requested',
  ACTIVATION_SUCCEEDED = '[Sign Up] Activation Succeeded',
  ACTIVATION_ERROR = '[Sign Up] Activation Error',

  SET_IS_SIGN_UP_OPENABLE_STATUS = '[Sign Up] Set Sign Up Openable Status',
  RESET_SIGN_UP = '[Sign Up] Reset',
  SET_DAYS_LEFT = '[Sign Up] Set Days Left',
  SET_SIGN_UP_TYPE = '[Sign Up] Set Sign Up Type',
}

export const signUpUserRequestedAction = createAction(
  SignUpActionTypes.SIGN_UP_USER_REQUESTED,
  props<UserProfileFormInterface>()
);

export const signUpUserSucceededAction = createAction(
  SignUpActionTypes.SIGN_UP_USER_SUCCEEDED
);

export const signUpUserErrorAction = createAction(
  SignUpActionTypes.SIGN_UP_USER_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetSignUpUserErrorAction = createAction(
  SignUpActionTypes.RESET_SIGN_UP_USER_ERROR
);

export const preSignUpUserRequestedAction = createAction(
  SignUpActionTypes.PRE_SIGN_UP_USER_REQUESTED,
  props<PreSignUpInterface>()
);

export const preSignUpUserSucceededAction = createAction(
  SignUpActionTypes.PRE_SIGN_UP_USER_SUCCEEDED
);

export const preSignUpUserErrorAction = createAction(
  SignUpActionTypes.PRE_SIGN_UP_USER_ERROR,
  props<FormServerErrorInterface>()
);

export const resetPreSignUpUserErrorAction = createAction(
  SignUpActionTypes.RESET_PRE_SIGN_UP_USER_ERROR
);

export const setPreSignUpInfoAction = createAction(
  SignUpActionTypes.SET_PRE_SIGN_UP_INFO,
  props<PreSignUpInterface>()
);

export const activationRequestedAction = createAction(
  SignUpActionTypes.ACTIVATION_REQUESTED,
  props<ActivationInterface>()
);

export const activationSucceededAction = createAction(
  SignUpActionTypes.ACTIVATION_SUCCEEDED
);

export const activationErrorAction = createAction(
  SignUpActionTypes.ACTIVATION_ERROR
);

export const resetSignUpAction = createAction(SignUpActionTypes.RESET_SIGN_UP);

export const setTrialEndDateAction = createAction(
  SignUpActionTypes.SET_DAYS_LEFT,
  props<TrialEndDateClientInterface>()
);

export interface IsSuccessSignUpOpenableActionInterface {
  status: boolean;
}

export const setIsSuccessSignUpOpenableStatusAction = createAction(
  SignUpActionTypes.SET_IS_SIGN_UP_OPENABLE_STATUS,
  props<IsSuccessSignUpOpenableActionInterface>()
);

export interface SetSignUpTypePayloadInterface {
  signUpType: string;
}

export const setSignUpTypeAction = createAction(
  SignUpActionTypes.SET_SIGN_UP_TYPE,
  props<SetSignUpTypePayloadInterface>()
);
