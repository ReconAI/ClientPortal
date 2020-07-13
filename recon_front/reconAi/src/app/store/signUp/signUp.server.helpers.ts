import {
  UserProfileFormInterface,
  ServerUserOrganizationInterface,
  CredentialsRequestInterface,
} from 'app/constants/types';

export interface PreSignUpInterface {
  login: string;
  password1: string;
  password2: string;
}



export const transformPreSignUpUserForm = ({
  login,
  password1,
  password2,
}: PreSignUpInterface): CredentialsRequestInterface => ({
  username: login,
  password1,
  password2,
});

export interface SignUpRequestInterface {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  password1: string;
  password2: string;
}
export const transformSignUpFormToRequest = (
  user: UserProfileFormInterface & CredentialsRequestInterface
): ServerUserOrganizationInterface & SignUpRequestInterface => ({
  username: user.username,
  email: user.user.email,
  firstname: user.user.firstName,
  lastname: user.user.lastName,
  address: user.user.address,
  phone: user.user.phone,
  password1: user.password1,
  password2: user.password2,
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
