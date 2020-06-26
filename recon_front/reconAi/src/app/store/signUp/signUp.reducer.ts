import { FormServerErrorInterface } from './../../constants/types/requests';
import { PreSignUpRequestBody } from './../signUp/signUp.server.helpers';
import { createReducer, on, Action } from '@ngrx/store';
import {
  setPreSignUpInfoAction,
  preSignUpUserErrorAction,
  resetPreSignUpUserErrorAction,
} from './signUp.actions';

export interface SignUpState {
  username: string;
  password1: string;
  password2: string;
  preSignUpError: string;
}

export const initialState: SignUpState = {
  username: null,
  password1: null,
  password2: null,
  preSignUpError: null,
};

const setPreSignUpInfoReducer = (
  state: SignUpState,
  { type, ...signUpInfo }: Action & PreSignUpRequestBody
): SignUpState => ({ ...state, ...signUpInfo });

const preSignUpUserErrorReducer = (
  state: SignUpState,
  { type, general }: FormServerErrorInterface
): SignUpState => ({
  ...state,
  preSignUpError: general,
});

const resetPreSignUpUserErrorReducer = (state: SignUpState): SignUpState => ({
  ...state,
  preSignUpError: null,
});

const signUpReducer = createReducer(
  initialState,
  on(setPreSignUpInfoAction, setPreSignUpInfoReducer),
  on(preSignUpUserErrorAction, preSignUpUserErrorReducer),
  on(resetPreSignUpUserErrorAction, resetPreSignUpUserErrorReducer)
);

export function reducer(state: SignUpState | undefined, action: Action) {
  return signUpReducer(state, action);
}
