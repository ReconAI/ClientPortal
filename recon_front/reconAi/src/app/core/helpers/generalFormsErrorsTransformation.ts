import { FormServerErrorInterface } from './../../constants/types/requests';
import { HttpErrorResponse } from '@angular/common/http';

export const generalTransformFormError = (
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
