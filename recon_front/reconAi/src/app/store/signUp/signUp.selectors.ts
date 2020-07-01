import {
  UserRoleTypes,
  UserRolesPriorities,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { SignUpState } from './signUp.reducer';
import { FormServerErrorInterface } from 'app/constants/types/requests';

export const selectSignUp = (state: AppState): SignUpState => state.signUp;

export const selectPreSignUpError = createSelector(
  selectSignUp,
  (signUp: SignUpState): string | null => signUp.errors?.preSignUp || ''
);

export const selectSignUpError = createSelector(
  selectSignUp,
  (signUp: SignUpState): FormServerErrorInterface | null =>
    signUp.errors?.signUp
);

export const selectSignUpUsername = createSelector(
  selectSignUp,
  (signUp: SignUpState): string => signUp.username
);

export const selectSignUpPassword1 = createSelector(
  selectSignUp,
  (signUp: SignUpState): string => signUp.password1
);

export const selectSignUpPassword2 = createSelector(
  selectSignUp,
  (signUp: SignUpState): string => signUp.password2
);

export const selectExistencePreSignUp = createSelector(
  selectSignUp,
  (signUp: SignUpState): boolean =>
    !!(signUp.password1 && signUp.password2 && signUp.username)
);
