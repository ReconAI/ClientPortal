import { CardClientInterface } from './../../constants/types/card';
import { UserProfileFormInterface } from 'app/constants/types';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import {
  UserTransformationResponse,
  LoadCardsRequestClientInterface,
} from './user.server.helpers';
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
  updateCurrentUserErrorAction,
  resetUpdateCurrentUserErrorAction,
  updateCurrentUserSucceededAction,
  loadUserCardsSucceededAction,
} from './user.actions';

export interface UserErrorsInterface {
  login: string;
  resetPassword: string;
  preResetPassword: string;
  updateCurrentUser: FormServerErrorInterface;
}

export const userErrorsInit: UserErrorsInterface = {
  login: null,
  resetPassword: null,
  preResetPassword: null,
  updateCurrentUser: null,
};
export interface UserState extends UserTransformationResponse {
  isAuthenticated: boolean;
  role: UserRoleTypes | null;
  rolePriority: UserRolesPriorities;
  isActive: boolean;
  payment: {
    cards: CardClientInterface[];
  };
  errors: UserErrorsInterface;
}

export const initialState: UserState = {
  // null is used to show that's auth status and role hasn't checked yet
  isAuthenticated: null,
  role: DEFAULT_USER_ROLE,
  rolePriority: DEFAULT_USER_ROLE_PRIORITY,
  user: null,
  organization: null,
  profile: null,
  invoicing: null,
  isActive: null,
  payment: null,
  errors: userErrorsInit,
};

const loadCurrentUserSucceededReducer = (
  state: UserState,
  { type, ...user }: Action & UserTransformationResponse
): UserState => ({
  ...state,
  ...user,
  isAuthenticated: user.rolePriority > UserRolesPriorities.UNAUTHORIZED_ROLE,
});

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

const updateCurrentUserSucceededReducer = (
  state: UserState,
  { type, ...user }: Action & UserProfileFormInterface
): UserState => ({
  ...state,
  organization: user.organization,
  user: user.user,
  invoicing: user.invoicing,
});

const updateCurrentUserErrorReducer = (
  state: UserState,
  { type, errors }: Action & ObjectFormErrorInterface
): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    updateCurrentUser: errors,
  },
});

const resetUpdateCurrentUserErrorReducer = (state: UserState): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    updateCurrentUser: userErrorsInit.updateCurrentUser,
  },
});

const loadUserCardsSucceededReducer = (
  state: UserState,
  { cards }: LoadCardsRequestClientInterface
): UserState => ({
  ...state,
  payment: {
    ...state.payment,
    cards,
  },
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
  on(logoutUserSucceededAction, logoutUserSucceededReducer),
  on(updateCurrentUserSucceededAction, updateCurrentUserSucceededReducer),
  on(updateCurrentUserErrorAction, updateCurrentUserErrorReducer),
  on(resetUpdateCurrentUserErrorAction, resetUpdateCurrentUserErrorReducer),
  on(loadUserCardsSucceededAction, loadUserCardsSucceededReducer)
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
