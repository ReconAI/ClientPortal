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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}
  readonly durationInSeconds = 3;
  readonly verticalPosition = 'top';
  readonly horizontalPosition = 'center';
  readonly defaultErrorMessage = 'Server error';
  readonly errorsToNotShowMessage = [
    '/api/profile',

    // forms
    '/api/reset-password',
    '/api/pre-signup',
    '/api/signup',
    '/api/reset',
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
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: ['recon-snackbar'],
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else if (
          Math.floor(error.status / 100) === 5 ||
          !this.errorsToNotShowMessage.includes(request?.url)
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
