import {
  PreSignUpInterface,
  TrialEndDateClientInterface,
} from './signUp.server.helpers';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import { createReducer, on, Action } from '@ngrx/store';
import {
  setPreSignUpInfoAction,
  preSignUpUserErrorAction,
  resetPreSignUpUserErrorAction,
  signUpUserErrorAction,
  resetSignUpUserErrorAction,
  resetSignUpAction,
  IsSuccessSignUpOpenableActionInterface,
  setIsSuccessSignUpOpenableStatusAction,
  setTrialEndDateAction,
  SetSignUpTypePayloadInterface,
  setSignUpTypeAction,
} from './signUp.actions';
import moment from 'moment';

interface SignUpErrors {
  preSignUp: string;
  signUp: FormServerErrorInterface;
}

const initialSignUpErrors = {
  preSignUp: null,
  signUp: null,
};
export interface SignUpState {
  username: string;
  password1: string;
  password2: string;
  isPossibleToOpenSignUp: boolean;
  errors: SignUpErrors;
  trialEndDate: string;
  type: string;
}

export const initialState: SignUpState = {
  username: null,
  password1: null,
  password2: null,
  isPossibleToOpenSignUp: false,
  errors: initialSignUpErrors,
  trialEndDate: null,
  type: null,
};

const setPreSignUpInfoReducer = (
  state: SignUpState,
  { type, ...signUpInfo }: Action & PreSignUpInterface
): SignUpState => ({
  ...state,
  username: signUpInfo.login,
  password1: signUpInfo.password1,
  password2: signUpInfo.password2,
});

const preSignUpUserErrorReducer = (
  state: SignUpState,
  { type, general }: FormServerErrorInterface
): SignUpState => ({
  ...state,
  errors: {
    ...state.errors,
    preSignUp: general,
  },
});

const resetPreSignUpUserErrorReducer = (state: SignUpState): SignUpState => ({
  ...state,
  errors: {
    ...state.errors,
    preSignUp: initialSignUpErrors.preSignUp,
  },
});

const signUpUserErrorReducer = (
  state: SignUpState,
  { type, errors }: ObjectFormErrorInterface & Action
): SignUpState => ({
  ...state,
  errors: {
    ...state.errors,
    signUp: errors,
  },
});

const resetSignUpUserErrorReducer = (state: SignUpState): SignUpState => ({
  ...state,
  errors: {
    ...state.errors,
    signUp: initialSignUpErrors.signUp,
  },
});

const setIsSuccessSignUpOpenableStatusReducer = (
  state: SignUpState,
  { status }: Action & IsSuccessSignUpOpenableActionInterface
): SignUpState => ({
  ...state,
  isPossibleToOpenSignUp: status,
  trialEndDate: status ? state.trialEndDate : null,
  type: status ? state.type : null,
});

const setTrialEndDateReducer = (
  state: SignUpState,
  { trialEndDate }: Action & TrialEndDateClientInterface
): SignUpState => ({
  ...state,
  trialEndDate,
});

const setSignUpTypeReducer = (
  state: SignUpState,
  { signUpType }: Action & SetSignUpTypePayloadInterface
): SignUpState => ({
  ...state,
  type: signUpType,
});

const resetSignUpReducer = (): SignUpState => initialState;

const signUpReducer = createReducer(
  initialState,
  on(setPreSignUpInfoAction, setPreSignUpInfoReducer),
  on(preSignUpUserErrorAction, preSignUpUserErrorReducer),
  on(resetPreSignUpUserErrorAction, resetPreSignUpUserErrorReducer),
  on(signUpUserErrorAction, signUpUserErrorReducer),
  on(resetSignUpUserErrorAction, resetSignUpUserErrorReducer),
  on(resetSignUpAction, resetSignUpReducer),
  on(
    setIsSuccessSignUpOpenableStatusAction,
    setIsSuccessSignUpOpenableStatusReducer
  ),
  on(setTrialEndDateAction, setTrialEndDateReducer),
  on(setSignUpTypeAction, setSignUpTypeReducer)
);

export function reducer(state: SignUpState | undefined, action: Action) {
  return signUpReducer(state, action);
}
