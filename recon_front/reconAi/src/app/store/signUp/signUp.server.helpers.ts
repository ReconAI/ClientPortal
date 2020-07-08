import { FormServerErrorInterface } from './../../constants/types/requests';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileFormInterface, ServerUserOrganizationInterface } from 'app/constants/types';

export interface PreSignUpInterface {
  login: string;
  password1: string;
  password2: string;
}

export interface PreSignUpRequestBody {
  username: string;
  password1: string;
  password2: string;
}

export const transformPreSignUpUserForm = ({
  login,
  password1,
  password2,
}: PreSignUpInterface): PreSignUpRequestBody => ({
  username: login,
  password1,
  password2,
});
export interface SignUpRequestInterface extends ServerUserOrganizationInterface {
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
  user: UserProfileFormInterface & PreSignUpRequestBody
): SignUpRequestInterface => ({
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

export const signUpRelationsFormAnsServerFields = {
  username: 'Login',
  email: 'User email',
  firstname: 'User first name',
  lastname: 'User last name',
  address: 'User address',
  phone: 'User phone',
  password1: 'Password',
  password2: 'Confirmation password',
  name: 'Organization name',
  vat: 'Organization VAT',
  main_firstname: 'Contact person first name',
  main_lastname: 'Contact person last name',
  main_address: 'Organization address',
  main_phone: 'Organization phone',
  main_email: 'Organization email',
  inv_firstname: 'Invoicing first name',
  inv_lastname: 'Invoicing last name',
  inv_address: 'Invoicing address',
  inv_phone: 'Invoicing phone',
  inv_email: 'Invoicing email',
};