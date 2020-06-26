import { ActivationInterface } from './../../constants/types/activation';
import { FormServerErrorInterface } from './../../constants/types/requests';
import { PreSignUpInterface } from './signUp.server.helpers';
import { SignUpState } from './signUp.reducer';
import { createAction, props } from '@ngrx/store';

export enum SignUpActionTypes {
  SIGN_UP_USER_REQUESTED = '[Sign Up] Sign Up User Requested',
  SIGN_UP_USER_SUCCEEDED = '[Sign Up] Sign Up User Succeeded',
  SIGN_UP_USER_ERROR = '[Sign Up] Sign Up User Error',

  SET_PRE_SIGN_UP_INFO = '[Sign Up] Set Pre Sign Up Info',
  PRE_SIGN_UP_USER_REQUESTED = '[Sign Up] Pre Sign Up User Requested',
  PRE_SIGN_UP_USER_SUCCEEDED = '[Sign Up] Pre Sign Up User Succeeded',
  PRE_SIGN_UP_USER_ERROR = '[Sign Up] Pre Sign Up User Error',
  RESET_PRE_SIGN_UP_USER_ERROR = '[Sign Up] Reset Pre Sign Up User Error',

  ACTIVATION_REQUESTED = '[Sign Up] Activation Requested',
  ACTIVATION_SUCCEEDED = '[Sign Up] Activation Succeeded',
  ACTIVATION_ERROR = '[Sign Up] Activation Error',
}

export const signUpUserRequestedAction = createAction(
  SignUpActionTypes.SIGN_UP_USER_REQUESTED
);

export const signUpUserSucceededAction = createAction(
  SignUpActionTypes.SIGN_UP_USER_SUCCEEDED,
  props<SignUpState>()
);

export const signUpUserErrorAction = createAction(
  SignUpActionTypes.SIGN_UP_USER_ERROR
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
