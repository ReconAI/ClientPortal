import { environment } from '@env';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlInterceptorInterface } from 'app/constants/types/requests';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}
  readonly durationInSeconds = 3;
  readonly defaultErrorMessage = 'Server error';
  readonly errorsToNotShowMessage: UrlInterceptorInterface[] = [
    { url: '/api/profile' },

    // forms
    { url: '/api/reset-password' },
    { url: '/api/pre-signup' },
    { url: '/api/signup' },
    { url: '/api/reset' },
    { url: '/api/api-token-auth' },
    { url: '/api/users', method: 'POST' },
    { url: '/api/users/invitations', method: 'PUT' },
    { url: '/order-api/management/manufacturers', method: 'POST' },
    { url: '/order-api/management/devices', method: 'POST' },
  ];

  createErrorServerMessage(error: HttpErrorResponse): string {
    const { errors } = error?.error;

    // server errors show only 'Server error'
    if (!errors || Math.floor(error.status / 100) === 5) {
      return this.defaultErrorMessage;
    }

    if (typeof errors === 'string') {
      return errors;
    }

    // it's used for forms
    const errorKeys = Object.keys(errors);
    if (errorKeys?.length) {
      return errorKeys.reduce(
        (resultError, errorKey) => (resultError += errors[errorKey]),
        ''
      );
    }

    return this.defaultErrorMessage;
  }

  openSnackBar(text = this.defaultErrorMessage) {
    this.snackBar.open(text, null, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['recon-snackbar'],
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        console.log(error, 'ERROR');
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else if (
          Math.floor(error.status / 100) === 5 ||
          !this.errorsToNotShowMessage.find(
            (req) =>
              req.url === request?.url &&
              (!req.method || req.method === request?.method)
          )
        ) {
          // server-side error
          errorMessage = this.createErrorServerMessage(error);
          // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        if (errorMessage) {
          this.openSnackBar(errorMessage);

          if (!environment.production) {
            console.error(errorMessage);
          }
        }

        return throwError(error);
      })
    );
  }
}
