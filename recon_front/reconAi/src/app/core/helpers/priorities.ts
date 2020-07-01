import {   UserRoleTypes, ROLES_AND_PRIORITIES_CONNECTIONS } from './../../constants/types/user';

import {
  UserRolesPriorities,
  DEFAULT_USER_ROLE_PRIORITY,
} from 'app/constants/types';

export const getUserPriorityByRole = (
  role: UserRoleTypes
): UserRolesPriorities => {
  return ROLES_AND_PRIORITIES_CONNECTIONS[role] || DEFAULT_USER_ROLE_PRIORITY;
};
