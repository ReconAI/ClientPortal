import { CardClientInterface } from './../../constants/types/card';
import { UserProfileFormInterface } from 'app/constants/types';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import {
  UserTransformationResponse,
  LoadCardsRequestClientInterface,
  SetDefaultPaymentMethodClientInterface,
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
  updateBasketAmountAction,
  UpdateBasketActionPayload,
  attachCardErrorAction,
  resetAttachCardErrorAction,
  newRequestFeatureErrorAction,
  resetNewRequestFeatureErrorAction,
  setDefaultPaymentMethodSucceededAction,
  SetAuthActionPayloadInterface,
  setAuthStatusAction,
} from './user.actions';
import { INVOICING_ACCOUNT } from 'app/constants';

export interface UserErrorsInterface {
  login: string;
  resetPassword: string;
  preResetPassword: string;
  attachCard: string;
  updateCurrentUser: FormServerErrorInterface;
  newRequestFeature: string;
}

export const userErrorsInit: UserErrorsInterface = {
  login: null,
  resetPassword: null,
  preResetPassword: null,
  attachCard: null,
  updateCurrentUser: null,
  newRequestFeature: null,
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
  // it's under control of basketService
  basketAmount: number;
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
  basketAmount: 0,
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

const updateBasketAmountReducer = (
  state: UserState,
  { amount }: Action & UpdateBasketActionPayload
): UserState => ({
  ...state,
  basketAmount: amount,
});

const attachCardErrorReducer = (
  state: UserState,
  { general }: (Action & FormServerErrorInterface) | null
): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    attachCard: general,
  },
});

const resetAttachCardErrorReducer = (state: UserState): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    attachCard: userErrorsInit.attachCard,
  },
});

const newRequestFeatureErrorReducer = (
  state: UserState,
  { general }: (Action & FormServerErrorInterface) | null
): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    newRequestFeature: general,
  },
});

const resetNewRequestFeatureErrorReducer = (state: UserState): UserState => ({
  ...state,
  errors: {
    ...state.errors,
    newRequestFeature: userErrorsInit.newRequestFeature,
  },
});

const setDefaultPaymentMethodSucceededReducer = (
  state: UserState,
  { cardId }: SetDefaultPaymentMethodClientInterface
): UserState => ({
  ...state,
  organization: {
    ...state.organization,
    defaultCardId: (cardId === INVOICING_ACCOUNT && INVOICING_ACCOUNT) || null,
  },
});

const setAuthStatusReducer = (
  state: UserState,
  { status }: SetAuthActionPayloadInterface
): UserState => ({
  ...state,
  isAuthenticated: status,
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
  on(loadUserCardsSucceededAction, loadUserCardsSucceededReducer),
  on(updateBasketAmountAction, updateBasketAmountReducer),
  on(attachCardErrorAction, attachCardErrorReducer),
  on(resetAttachCardErrorAction, resetAttachCardErrorReducer),
  on(newRequestFeatureErrorAction, newRequestFeatureErrorReducer),
  on(resetNewRequestFeatureErrorAction, resetNewRequestFeatureErrorReducer),
  on(
    setDefaultPaymentMethodSucceededAction,
    setDefaultPaymentMethodSucceededReducer
  ),
  on(setAuthStatusAction, setAuthStatusReducer)
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}
