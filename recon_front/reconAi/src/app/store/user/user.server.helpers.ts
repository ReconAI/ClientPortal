import {
  CardClientInterface,
  CardServerInterface,
} from './../../constants/types/card';
import { ResetPasswordWithMetaInterface } from 'app/constants/types/resetPassword';
import { getUserPriorityByRole } from './../../core/helpers/priorities';
import {
  UserRolesPriorities,
  ServerUserInterface,
  UserProfileFormInterface,
} from 'app/constants/types';
import {
  UserRoleTypes,
  DEFAULT_AUTHORIZED_USER_ROLE,
  ServerUserOrganizationInterface,
  UpdateUserServerRequestInterface,
} from './../../constants/types/user';
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpRequestInterface } from '../signUp/signUp.server.helpers';
import { getBase64 } from 'app/core/helpers';
export interface UserTransformationResponse extends UserProfileFormInterface {
  isAuthenticated?: boolean;
  role: UserRoleTypes | null;
  rolePriority: UserRolesPriorities;
  isActive: boolean;
}

export const transformUserResponse = (
  response: ServerUserInterface
): UserTransformationResponse => ({
  isAuthenticated: null,
  role: response?.group?.name || DEFAULT_AUTHORIZED_USER_ROLE,
  rolePriority: getUserPriorityByRole(response?.group?.name),
  isActive: response.is_active,
  profile: {
    username: response.username,
    id: response.id,
  },
  user: {
    firstName: response.firstname,
    lastName: response.lastname,
    address: response.address,
    phone: response.phone,
    email: response.email,
  },
  organization: {
    name: response.organization.name,
    firstName: response.organization.main_firstname,
    lastName: response.organization.main_lastname,
    phone: response.organization.main_phone,
    email: response.organization.main_email,
    address: response.organization.main_address,
    vat: response.organization.vat,
  },
  invoicing: {
    firstName: response.organization.inv_firstname,
    lastName: response.organization.inv_lastname,
    address: response.organization.inv_address,
    phone: response.organization.inv_phone,
    email: response.organization.inv_email,
  },
});

export interface LoginUserFormInterface {
  login: string;
  password1: string;
}

export interface ServerLoginUserFormInterface {
  username: string;
  password: string;
}

export interface ServerLoginUserResponseInterface {
  token: string;
}

export const transformLoginUserForm = ({
  login,
  password1,
}: LoginUserFormInterface): ServerLoginUserFormInterface => ({
  username: login,
  password: password1,
});
export interface PreResetPasswordRequestInterface {
  email: string;
}

export interface ResetPasswordRequestInterface {
  token: string;
  uidb64: string;
  new_password1: string;
  new_password2: string;
}

export const transformResetPasswordFormToRequest = ({
  uidb64,
  token,
  password1,
  password2,
}: ResetPasswordWithMetaInterface): ResetPasswordRequestInterface => ({
  token,
  uidb64,
  new_password1: password1,
  new_password2: password2,
});

export const transformUpdateCurrentUserToServer = (
  user: UserProfileFormInterface,
  username
): ServerUserOrganizationInterface & UpdateUserServerRequestInterface => ({
  username,
  firstname: user.user.firstName,
  lastname: user.user.lastName,
  address: user.user.address,
  phone: user.user.phone,
  name: user.organization.name,
  vat: user.organization.vat,
  main_firstname: user.organization.firstName,
  main_lastname: user.organization.lastName,
  main_address: user.organization.address,
  main_phone: user.organization.phone,
  main_email: user.organization.email,
  inv_firstname: user.invoicing.firstName,
  inv_lastname: user.invoicing.lastName,
  inv_address: user.invoicing.address,
  inv_phone: user.invoicing.phone,
  inv_email: user.invoicing.email,
});

export interface AttachCardRequestServerInterface {
  payment_method: string;
}

export interface AttachCardRequestClientInterface {
  method: {
    paymentMethod: string;
  };
}

export const transformAttachCardRequestToServer = (
  card: AttachCardRequestClientInterface
): AttachCardRequestServerInterface => ({
  payment_method: card.method.paymentMethod,
});

export interface LoadCardsRequestClientInterface {
  cards: CardClientInterface[];
}

export const transformCardListFromServer = (
  cards: CardServerInterface[]
): LoadCardsRequestClientInterface => ({
  cards: cards.map(({ card, id }) => ({
    id,
    expired: `${card.exp_month < 10 ? '0' : ''}${card.exp_month}/${
      card.exp_year % 100
    }`,
    last4: card.last4,
    brand: card.brand.toUpperCase(),
  })),
});

export interface DeleteUserCardRequestInterface {
  id: string;
}

export interface DetachCardRequestServerInterface {
  payment_method: string;
}

export const transformDetachCardRequestToServer = ({
  id,
}: DeleteUserCardRequestInterface): DetachCardRequestServerInterface => ({
  payment_method: id,
});

export interface NewRequestFeatureServerInterface {
  description: string;
  sensor_feed_links: string[];
  files: string[];
}

export interface NewRequestFeatureClientInterface {
  newRequestFeature: {
    description: string;
    feedLinks: string[];
    files: File[];
  };
}

export const transformNewRequestToServer = async ({
  newRequestFeature,
}: NewRequestFeatureClientInterface): Promise<
  NewRequestFeatureServerInterface
> => {
  const files = newRequestFeature.files;
  const based64Files: string[] = [];

  for (let i = 0; i < files.length; i++) {
    based64Files.push((await getBase64(files[i] as File)).toString());
  }

  return {
    description: newRequestFeature.description,
    sensor_feed_links: newRequestFeature.feedLinks,
    files: based64Files,
  };
};
