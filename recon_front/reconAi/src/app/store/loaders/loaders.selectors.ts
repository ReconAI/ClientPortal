import { LoadersState } from './loaders.reducer';
import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';

export const selectLoaders = (state: AppState): LoadersState => state.loaders;

export const selectCurrentUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.currentUser
);

export const selectLoginLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.loginUser
);

export const selectGlobalLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.global
);

export const selectPreSignUpLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.preSignUp
);

export const selectSignUpLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.signUp
);

export const selectActivationLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.userActivation
);

export const selectResetPasswordLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.resetPassword
);

export const selectPreResetPasswordLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.preResetPassword
);

export const selectUsersListLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.userList
);

export const selectUserProfileLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.userProfile
);

export const selectDeleteUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.deleteUser
);

export const selectAddUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.addUser
);

export const selectInviteUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.inviteUser
);

export const selectInviteSignUpUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.inviteSignUpUser
);

export const selectUpdateCurrentUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.updateCurrentUser
);

export const selectUpdateUserLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.updateUser
);

// orders
export const selectCategoriesListLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.categoriesList
);

export const selectUpdateCategoriesListLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.updateCategoriesList
);

export const selectCreateManufacturerLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.createManufacturer
);

export const selectManufacturerListLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.manufacturerList
);

export const selectCreateDeviceLoadingStatus = createSelector(
  selectLoaders,
  (loaders: LoadersState): boolean => loaders.createDevice
);
