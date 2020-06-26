import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { SignUpState } from './signUp.reducer';

export const selectSignUp = (state: AppState): SignUpState => state.signUp;

export const selectPreSignUpError = createSelector(
  selectSignUp,
  (signUp: SignUpState): string | null => signUp.preSignUpError
);
