import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from './../../constants/types/requests';
import { HttpErrorResponse } from '@angular/common/http';

export const generalTransformFormErrorToString = (
  error: HttpErrorResponse
): FormServerErrorInterface | null => {
  const errors = error?.error?.errors;

  console.log(error, 'ERROR');
  if (errors) {
    if (error.status === 400 || error.status === 422 || error.status === 404) {
      if (typeof errors === 'string') {
        return {
          general: errors,
        };
      }
      return {
        general: Object.keys(errors).reduce(
          (finalError, key) => (finalError += ` ${errors[key].join('\n')}\n`),
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
              ? '\n' + errors[key]?.join('\n')
              : errors[key],
          }),
          {}
        ),
      };
    }
  }

  return null;
};

export const generalTransformationObjectErrorsForComponent = (
  error: FormServerErrorInterface
): string =>
  (error &&
    Object.keys(error)?.reduce(
      (final, key) => `${final}\n${key}: ${error[key]}`,
      ''
    )) ||
  '';
