import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import { HttpErrorResponse } from '@angular/common/http';

export const generalTransformFormErrorToString = (
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

export interface RelationsInterface {
  [key: string]: string;
}

export const generalTransformFormErrorToObject = (
  error: HttpErrorResponse,
  relations: RelationsInterface = {},
  isValuesToString: boolean = true
): ObjectFormErrorInterface | null => {
  const errors = error?.error?.errors;

  if (error.status === 400 || error.status === 422) {
    if (errors) {
      return {
        errors: Object.keys(errors).reduce(
          (finalError, key) => ({
            ...finalError,
            [relations[key] || key]: isValuesToString
              ? errors[key]?.join(' ')
              : errors[key],
          }),
          {}
        ),
      };
    }
  }

  return null;
};
