import { createSelector } from '@ngrx/store';

import { AppState } from './../reducers/index';
import { UsersState, UsersErrors } from './users.reducer';
import { UserInterface } from '../../users/constants/types';
import {
  UserProfileFormInterface,
  UserProfileFormOrganizationInterface,
  UserProfileFormUserInterface,
  UserProfileFormInvoicingInterface,
} from 'app/constants/types';

export const selectUsers = (state: AppState): UsersState => state.users;

export const selectUsersList = createSelector(
  selectUsers,
  (users: UsersState): UserInterface[] => users.list
);

export const selectUsersMetaPageSize = createSelector(
  selectUsers,
  (users: UsersState): number => users.meta?.pageSize || 0
);

export const selectUsersMetaTotalCount = createSelector(
  selectUsers,
  (users: UsersState): number => users.meta?.count || 0
);

export const selectUsersMetaCurrentPage = createSelector(
  selectUsers,
  (users: UsersState): number => users.meta?.currentPage || 0
);

export const selectUserProfile = createSelector(
  selectUsers,
  (users: UsersState): UserProfileFormInterface => users.user
);

// User Profile
// Organization
export const selectUserProfileOrganization = createSelector(
  selectUserProfile,
  (user: UserProfileFormInterface): UserProfileFormOrganizationInterface =>
    user?.organization
);

export const selectUserProfileOrganizationName = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.name || ''
);

export const selectUserProfileOrganizationPhone = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.phone || ''
);

export const selectUserProfileOrganizationEmail = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.email || ''
);

export const selectUserProfileOrganizationAddress = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.address || ''
);

export const selectUserProfileOrganizationVat = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.vat || ''
);

export const selectUserProfileOrganizationFirstName = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.firstName || ''
);

export const selectUserProfileOrganizationLastName = createSelector(
  selectUserProfileOrganization,
  (organization: UserProfileFormOrganizationInterface): string =>
    organization?.lastName || ''
);

// User
export const selectUserProfileUser = createSelector(
  selectUserProfile,
  (user: UserProfileFormInterface): UserProfileFormUserInterface => user?.user
);

export const selectUserProfileUserPhone = createSelector(
  selectUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.phone || ''
);

export const selectUserProfileUserEmail = createSelector(
  selectUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.email || ''
);

export const selectUserProfileUserAddress = createSelector(
  selectUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.address || ''
);

export const selectUserProfileUserFirstName = createSelector(
  selectUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.firstName || ''
);

export const selectUserProfileUserLastName = createSelector(
  selectUserProfileUser,
  (user: UserProfileFormUserInterface): string => user?.lastName || ''
);

// invoicing
export const selectUserProfileInvoicing = createSelector(
  selectUserProfile,
  (user: UserProfileFormInterface): UserProfileFormInvoicingInterface =>
    user?.invoicing
);

export const selectUserProfileInvoicingPhone = createSelector(
  selectUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.phone || ''
);

export const selectUserProfileInvoicingEmail = createSelector(
  selectUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.email || ''
);

export const selectUserProfileInvoicingAddress = createSelector(
  selectUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.address || ''
);

export const selectUserProfileInvoicingFirstName = createSelector(
  selectUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.firstName || ''
);

export const selectUserProfileInvoicingLastName = createSelector(
  selectUserProfileInvoicing,
  (invoicing: UserProfileFormInvoicingInterface): string =>
    invoicing?.lastName || ''
);

// check whether user's found
export const selectWhetherUserProfileFound = createSelector(
  selectUserProfile,
  (user: UserProfileFormInterface): boolean => !!user
);

const selectUsersError = createSelector(
  selectUsers,
  (users: UsersState): UsersErrors => users?.errors || null
);

export const selectAddUserError = createSelector(
  selectUsersError,
  (errors: UsersErrors): string => errors.addUser
);
