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
