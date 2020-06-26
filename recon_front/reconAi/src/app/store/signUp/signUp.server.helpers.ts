import { FormServerErrorInterface } from './../../constants/types/requests';
import { HttpErrorResponse } from '@angular/common/http';

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

export const transformErrorPreSignUp = (
  error: HttpErrorResponse
): FormServerErrorInterface | null => {
  const errors = error?.error?.errors;

  if (error.status === 400 || error.status === 422) {
    if (errors) {
      return {
        general: Object.keys(errors).reduce(
          (finalError, key) => (finalError += `${errors[key].join(' ')}`),
          ''
        ),
      };
    }
  }

  return null;
};
