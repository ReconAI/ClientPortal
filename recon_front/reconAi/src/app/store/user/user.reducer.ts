import { FormServerErrorInterface } from './../../constants/types/requests';
import { UserTransformationResponse } from './user.server.helpers';
import {
  UserRoleTypes,
  DEFAULT_USER_ROLE,
  UserRolesPriorities,
  DEFAULT_USER_ROLE_PRIORITY,
} from './../../constants/types/user';
import { createReducer, on, Action } from '@ngrx/store';
import {
  loadCurrentUserSucceededAction,
  resetCurrentUserAction,
  loadCurrentUserErrorAction,
  loginUserErrorAction,
  resetLoginUserErrorAction,
  resetPasswordErrorAction,
  resetResetPasswordErrorAction,
  preResetPasswordErrorAction,
  preResetResetPasswordErrorAction,
  logoutUserSucceededAction,
} from './user.actions';

export interface UserErrorsInterface {
  login: string;
  resetPassword: string;
  preResetPassword: string;
}

export const userErrorsInit: UserErrorsInterface = {
  login: null,
  resetPassword: null,
  preResetPassword: null,
};
export interface UserState {
  isAuthenticated: boolean;
  role: UserRoleTypes | null;
  rolePriority: UserRolesPriorities;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  username: string;
  errors: UserErrorsInterface;
}

export const initialState: UserState = {
  // null is used to show that's auth status and role hasn't checked yet
  isAuthenticated: null,
  role: DEFAULT_USER_ROLE,
  rolePriority: DEFAULT_USER_ROLE_PRIORITY,
  firstName: null,
  lastName: null,
  address: null,
  phone: null,
  email: null,
  isActive: null,
  username: null,
  errors: userErrorsInit,
};

const loadCurrentUserSucceededReducer = (
  state: UserState,
  { type, ...user }: Action & UserTransformationResponse
): UserState => ({ ...state, ...user, isAuthenticated: true });

const resetCurrentUserReducer = (state: UserState): UserState => initialState;

const loadCurrentUserErrorReducer = (state: UserState): UserState => ({
  ...state,
  isAuthenticated: false,
});

const loginUserErrorReducer = (
  state: UserState,
  { general }: (Action & FormServerErrorInterface) | null
): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    login: general,
  },
});

const resetLoginUserErrorReducer = (state: UserState): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    login: userErrorsInit.login,
  },
});

const preResetPasswordErrorReducer = (
  state: UserState,
  { general }: (Action & FormServerErrorInterface) | null
): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    preResetPassword: general,
  },
});

const preResetResetPasswordErrorReducer = (state: UserState): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    preResetPassword: userErrorsInit.preResetPassword,
  },
});

const resetPasswordErrorReducer = (
  state: UserState,
  { general }: (Action & FormServerErrorInterface) | null
): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    resetPassword: general,
  },
});

const resetResetPasswordErrorReducer = (state: UserState): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    resetPassword: userErrorsInit.resetPassword,
  },
});

const logoutUserSucceededReducer = (state: UserState): UserState => ({
  ...state,
  isAuthenticated: false,
});

const userReducer = createReducer(
  initialState,
  on(loadCurrentUserSucceededAction, loadCurrentUserSucceededReducer),
  on(resetCurrentUserAction, resetCurrentUserReducer),
  on(loadCurrentUserErrorAction, loadCurrentUserErrorReducer),
  on(loginUserErrorAction, loginUserErrorReducer),
  on(resetLoginUserErrorAction, resetLoginUserErrorReducer),
  on(preResetPasswordErrorAction, preResetPasswordErrorReducer),
  on(preResetResetPasswordErrorAction, preResetResetPasswordErrorReducer),
  on(resetPasswordErrorAction, resetPasswordErrorReducer),
  on(resetResetPasswordErrorAction, resetResetPasswordErrorReducer),
  on(logoutUserSucceededAction, logoutUserSucceededReducer)
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
