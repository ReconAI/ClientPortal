import {
  LoaderInterface,
  setCurrentUserLoadingStatusAction,
  setLoginLoadingStatusAction,
  setLogoutLoadingStatusAction,
  setPreSignUpLoadingStatusAction,
  setActivationLoadingStatusAction,
  setResetPasswordLoadingStatusAction,
  setPreResetPasswordLoadingStatusAction,
  setSignUpLoadingStatusAction,
} from './loaders.actions';
import { createReducer, on, Action } from '@ngrx/store';

// maybe add universal one and add structure
export interface LoadersState {
  currentUser: boolean;
  loginUser: boolean;
  logoutUser: boolean;
  global: boolean;
  preSignUp: boolean;
  signUp: boolean;
  userActivation: boolean;
  resetPassword: boolean;
  preResetPassword: boolean;
}

const initialState: LoadersState = {
  currentUser: false,
  loginUser: false,
  logoutUser: false,
  preSignUp: false,
  signUp: false,
  global: false,
  userActivation: false,
  resetPassword: false,
  preResetPassword: false,
};

const setCurrentUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, currentUser: status, global: status });

const setLoginLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, loginUser: status });

const setLogoutLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, logoutUser: status, global: status });

const setPreSignUpLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, preSignUp: status });

const setSignUpLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, signUp: status });

const setActivationLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, userActivation: status, global: status });

const setPreResetPasswordLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, preResetPassword: status });

const setResetPasswordLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, resetPassword: status });

const loadersReducer = createReducer(
  initialState,
  on(setCurrentUserLoadingStatusAction, setCurrentUserLoadingStatusReducer),
  on(setLoginLoadingStatusAction, setLoginLoadingStatusReducer),
  on(setLogoutLoadingStatusAction, setLogoutLoadingStatusReducer),
  on(setPreSignUpLoadingStatusAction, setPreSignUpLoadingStatusReducer),
  on(setSignUpLoadingStatusAction, setSignUpLoadingStatusReducer),
  on(setActivationLoadingStatusAction, setActivationLoadingStatusReducer),
  on(setResetPasswordLoadingStatusAction, setResetPasswordLoadingStatusReducer),
  on(setPreResetPasswordLoadingStatusAction, setPreResetPasswordLoadingStatusReducer),
);

export function reducer(state: LoadersState | undefined, action: Action) {
  return loadersReducer(state, action);
}
