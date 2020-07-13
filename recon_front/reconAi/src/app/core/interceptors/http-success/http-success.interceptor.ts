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
import { UrlInterceptorInterface } from 'app/constants/types/requests';

@Injectable()
export class HttpSuccessInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}
  readonly durationInSeconds = 3;
  readonly urlsToNotShow: UrlInterceptorInterface[] = [
    { url: '/api/users/invitations', method: 'POST' },
  ];

  createSuccessServerMessage(response: HttpResponse<any>): string {
    return response?.body?.message || '';
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, null, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['recon-snackbar', 'success-snackbar'],
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (
          event instanceof HttpResponse &&
          event?.body?.message &&
          !this.urlsToNotShow.find(
            (req) =>
              req.url === request.url &&
              (!req.method || req.method === request.method)
          )
        ) {
          this.openSnackBar(this.createSuccessServerMessage(event));
        }
      })
    );
  }
}
