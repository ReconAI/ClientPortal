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
  setUserListLoadingStatusAction,
  setUserProfileLoadingStatusAction,
  setDeleteUserLoadingStatusAction,
  setAddUserLoadingStatusAction,
  setInviteUserLoadingStatusAction,
  setInviteSignUpUserLoadingStatusAction,
  setUpdateCurrentUserLoadingStatusAction,
  setUpdateUserLoadingStatusAction,
  setCategoriesListLoadingStatusAction,
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
  userList: boolean;
  userProfile: boolean;
  deleteUser: boolean;
  addUser: boolean;
  inviteUser: boolean;
  inviteSignUpUser: boolean;
  updateCurrentUser: boolean;
  updateUser: boolean;
  // orders
  categoriesList: boolean;
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
  userList: false,
  userProfile: false,
  deleteUser: false,
  addUser: false,
  inviteUser: false,
  inviteSignUpUser: false,
  updateCurrentUser: false,
  updateUser: false,
  // orders
  categoriesList: false,
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

const setUserListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, userList: status });

const setUserProfileLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, userProfile: status });

const setDeleteUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, deleteUser: status });

const setAddUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, addUser: status });

const setInviteUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, inviteUser: status });

const setInviteSignUpUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, inviteSignUpUser: status });

const setUpdateCurrentUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, updateCurrentUser: status });

const setUpdateUserLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, updateUser: status });

// orders
const setCategoriesListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, categoriesList: status });

const loadersReducer = createReducer(
  initialState,
  on(setCurrentUserLoadingStatusAction, setCurrentUserLoadingStatusReducer),
  on(setLoginLoadingStatusAction, setLoginLoadingStatusReducer),
  on(setLogoutLoadingStatusAction, setLogoutLoadingStatusReducer),
  on(setPreSignUpLoadingStatusAction, setPreSignUpLoadingStatusReducer),
  on(setSignUpLoadingStatusAction, setSignUpLoadingStatusReducer),
  on(setActivationLoadingStatusAction, setActivationLoadingStatusReducer),
  on(setResetPasswordLoadingStatusAction, setResetPasswordLoadingStatusReducer),
  on(
    setPreResetPasswordLoadingStatusAction,
    setPreResetPasswordLoadingStatusReducer
  ),
  on(setUserListLoadingStatusAction, setUserListLoadingStatusReducer),
  on(setUserProfileLoadingStatusAction, setUserProfileLoadingStatusReducer),
  on(setDeleteUserLoadingStatusAction, setDeleteUserLoadingStatusReducer),
  on(setAddUserLoadingStatusAction, setAddUserLoadingStatusReducer),
  on(setInviteUserLoadingStatusAction, setInviteUserLoadingStatusReducer),
  on(
    setInviteSignUpUserLoadingStatusAction,
    setInviteSignUpUserLoadingStatusReducer
  ),
  on(
    setUpdateCurrentUserLoadingStatusAction,
    setUpdateCurrentUserLoadingStatusReducer
  ),
  on(setUpdateUserLoadingStatusAction, setUpdateUserLoadingStatusReducer),
  // orders
  on(
    setCategoriesListLoadingStatusAction,
    setCategoriesListLoadingStatusReducer
  )
);

export function reducer(state: LoadersState | undefined, action: Action) {
  return loadersReducer(state, action);
}
