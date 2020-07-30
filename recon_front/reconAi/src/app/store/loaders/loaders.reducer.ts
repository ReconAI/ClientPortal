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
  setUpdateCategoriesListLoadingStatusAction,
  setCreateManufacturerLoadingStatusAction,
  setManufacturerListLoadingStatusAction,
  setCreateDeviceLoadingStatusAction,
  setDeviceListLoadingStatusAction,
  setDeleteDeviceLoadingStatusAction,
  setManagementDeviceLoadingStatusAction,
  setUpdateDeviceLoadingStatusAction,
  setDeviceLoadingStatusAction,
  setAttachCardLoadingStatusAction,
  setUserCardsLoadingStatusAction,
  setAllCategoriesListLoadingStatusAction,
  setDetachCardLoadingStatusAction,
  setBasketOverviewLoadingStatusAction,
  setPayBasketLoadingStatusAction,
  setPurchaseListLoadingStatusAction,
  setPurchaseLoadingStatusAction,
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
  allCategoriesList: boolean;
  updateCategoriesList: boolean;
  createManufacturer: boolean;
  manufacturerList: boolean;
  createDevice: boolean;
  deviceList: boolean;
  deleteDevice: boolean;
  managementDevice: boolean;
  updateDevice: boolean;
  device: boolean;
  // user -> cards
  attachCard: boolean;
  detachCard: boolean;
  userCards: boolean;
  // orders -> basket
  basketOverview: boolean;
  payBasket: boolean;
  // purchase
  purchaseList: boolean;
  purchase: boolean;
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
  allCategoriesList: false,
  updateCategoriesList: false,
  createManufacturer: false,
  manufacturerList: false,
  createDevice: false,
  deviceList: false,
  deleteDevice: false,
  managementDevice: false,
  updateDevice: false,
  device: false,
  // user -> cards
  attachCard: false,
  detachCard: false,
  userCards: false,
  // orders -> basket
  basketOverview: false,
  payBasket: false,
  // purchase
  purchaseList: false,
  purchase: false,
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

const setAllCategoriesListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, allCategoriesList: status });

const setUpdateCategoriesListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, updateCategoriesList: status });

const setCreateManufacturerLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, createManufacturer: status });

const setManufacturerListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, manufacturerList: status });

const setCreateDeviceLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, createDevice: status });

const setDeviceListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, deviceList: status });

const setDeleteDeviceLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, deleteDevice: status });

const setManagementDeviceLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, managementDevice: status });

const setUpdateDeviceLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, updateDevice: status });

const setDeviceLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, device: status });

// user -> cards
const setAttachCardLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, attachCard: status });

const setDetachCardLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, detachCard: status });

const setUserCardsLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, userCards: status });

// orders -> basket
const setBasketOverviewLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, basketOverview: status });

const setPayBasketLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, payBasket: status });

const setPurchaseListLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, purchaseList: status });

const setPurchaseLoadingStatusReducer = (
  state: LoadersState,
  { status }: Action & LoaderInterface
): LoadersState => ({ ...state, purchase: status });

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
  ),
  on(
    setAllCategoriesListLoadingStatusAction,
    setAllCategoriesListLoadingStatusReducer
  ),
  on(
    setUpdateCategoriesListLoadingStatusAction,
    setUpdateCategoriesListLoadingStatusReducer
  ),
  on(
    setCreateManufacturerLoadingStatusAction,
    setCreateManufacturerLoadingStatusReducer
  ),
  on(
    setManufacturerListLoadingStatusAction,
    setManufacturerListLoadingStatusReducer
  ),
  on(setCreateDeviceLoadingStatusAction, setCreateDeviceLoadingStatusReducer),
  on(setDeviceListLoadingStatusAction, setDeviceListLoadingStatusReducer),
  on(setDeleteDeviceLoadingStatusAction, setDeleteDeviceLoadingStatusReducer),
  on(
    setManagementDeviceLoadingStatusAction,
    setManagementDeviceLoadingStatusReducer
  ),
  on(setUpdateDeviceLoadingStatusAction, setUpdateDeviceLoadingStatusReducer),
  on(setDeviceLoadingStatusAction, setDeviceLoadingStatusReducer),
  // user -> cards
  on(setAttachCardLoadingStatusAction, setAttachCardLoadingStatusReducer),
  on(setDetachCardLoadingStatusAction, setDetachCardLoadingStatusReducer),
  on(setUserCardsLoadingStatusAction, setUserCardsLoadingStatusReducer),
  // orders -> basket
  on(
    setBasketOverviewLoadingStatusAction,
    setBasketOverviewLoadingStatusReducer
  ),
  on(setPayBasketLoadingStatusAction, setPayBasketLoadingStatusReducer),
  // purchase
  on(setPurchaseListLoadingStatusAction, setPurchaseListLoadingStatusReducer),
  on(setPurchaseLoadingStatusAction, setPurchaseLoadingStatusReducer)
);

export function reducer(state: LoadersState | undefined, action: Action) {
  return loadersReducer(state, action);
}
