import { filter, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpSuccessInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}
  readonly durationInSeconds = 3;
  readonly verticalPosition = 'top';
  readonly horizontalPosition = 'center';

  createSuccessServerMessage(response: HttpResponse<any>): string {
    return response?.body?.message || '';
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, null, {
      duration: this.durationInSeconds * 1000,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      panelClass: ['recon-snackbar', 'success-snackbar'],
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event?.body?.message) {
          this.openSnackBar(this.createSuccessServerMessage(event));
        }
      })
    );
  }
}