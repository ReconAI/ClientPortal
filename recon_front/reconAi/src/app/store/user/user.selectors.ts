import { CardClientInterface } from './../../constants/types/card';
import { selectUserProfile } from './../users/users.selectors';
import { FormServerErrorInterface } from './../../constants/types/requests';
import {
  UserRoleTypes,
  UserRolesPriorities,
  UserProfileFormUserInterface,
  UserProfileFormOrganizationInterface,
  UserProfileFormInvoicingInterface,
} from './../../constants/types/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState): UserState => state.user;

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user: UserState): boolean | null => user.isAuthenticated
);

export const selectIsNotAuthenticated = createSelector(
  selectUser,
  (user: UserState): boolean | null =>
    user.isAuthenticated === null ? null : !user.isAuthenticated
);

export const selectUserRole = createSelector(
  selectUser,
  (user: UserState): UserRoleTypes => user.role
);

export const selectUserRolePriority = createSelector(
  selectUser,
  (user: UserState): UserRolesPriorities | null => user.rolePriority
);

export const selectLoginErrorsStatus = createSelector(
  selectUser,
  (user: UserState): string => user?.errors?.login || ''
);

export const selectCurrentUserName = createSelector(
  selectUser,
  (user: UserState): string => user?.profile?.username || ''
);

export const selectPreResetPasswordError = createSelector(
  selectUser,
  (user: UserState): string => user?.errors?.preResetPassword || ''
);

export const selectResetPasswordError = createSelector(
  selectUser,
  (user: UserState): string => user?.errors?.resetPassword || ''
);

// current user profile
// Organization
export const selectCurrentUserOrganization = createSelector(
  selectUser,
  (user: UserState): UserProfileFormOrganizationInterface => user.organization
);

export const selectCurrentUserProfileOrganizationName = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.name || ''
);

export const selectCurrentUserProfileOrganizationPhone = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.phone || ''
);

export const selectCurrentUserProfileOrganizationEmail = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.email || ''
);

export const selectCurrentUserProfileOrganizationAddress = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.address || ''
);

export const selectCurrentUserProfileOrganizationVat = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.vat || ''
);

export const selectCurrentUserProfileOrganizationFirstName = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.firstName || ''
);

export const selectCurrentUserProfileOrganizationLastName = createSelector(
  selectCurrentUserOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.lastName || ''
);

// User
export const selectCurrentUserProfileUser = createSelector(
  selectUser,
  (user: UserState): UserProfileFormUserInterface => user.user
);

export const selectCurrentUserProfileUserPhone = createSelector(
  selectCurrentUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.phone || ''
);

export const selectCurrentUserProfileUserEmail = createSelector(
  selectCurrentUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.email || ''
);

export const selectCurrentUserProfileUserAddress = createSelector(
  selectCurrentUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.address || ''
);

export const selectCurrentUserProfileUserFirstName = createSelector(
  selectCurrentUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.firstName || ''
);

export const selectCurrentUserProfileUserLastName = createSelector(
  selectCurrentUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.lastName || ''
);

// invoicing
export const selectCurrentUserProfileInvoicing = createSelector(
  selectUser,
  (user: UserState): UserProfileFormInvoicingInterface => user?.invoicing
);

export const selectCurrentUserProfileInvoicingPhone = createSelector(
  selectCurrentUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.phone || ''
);

export const selectCurrentUserProfileInvoicingEmail = createSelector(
  selectCurrentUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.email || ''
);

export const selectCurrentUserProfileInvoicingAddress = createSelector(
  selectCurrentUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.address || ''
);

export const selectCurrentUserProfileInvoicingFirstName = createSelector(
  selectCurrentUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.firstName || ''
);

export const selectCurrentUserProfileInvoicingLastName = createSelector(
  selectCurrentUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.lastName || ''
);

export const selectCurrentUserUpdateError = createSelector(
  selectUser,
  (user: UserState): FormServerErrorInterface => user?.errors?.updateCurrentUser
);

export const selectCurrentUserProfileId = createSelector(
  selectUser,
  (user: UserState): string => user?.profile?.id
);

// user -> cards
export const selectUserCards = createSelector(
  selectUser,
  (user: UserState): CardClientInterface[] => user?.payment?.cards || []
);
