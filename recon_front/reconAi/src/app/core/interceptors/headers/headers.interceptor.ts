import { LocalStorageService } from './../../services/localStorage/local-storage.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  readonly AUTH_HEADER = 'Authorization';
  readonly urlsWithoutToken = [
    '/api/api-token-auth',
    '/api/signup',
    '/api/reset-password',
    '/api/pre-signup',
    '/api/reset',
    '/api/users/invitations',
  ];

  constructor(private localStorageService: LocalStorageService) {}

  private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    let requestClone = null;
    if (!request.headers.has('Content-Type')) {
      requestClone = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    return requestClone || request;
  }

  private addAuthenticationToken(
    request: HttpRequest<unknown>
  ): HttpRequest<unknown> {
    // check if we should add token
    if (!this.urlsWithoutToken.includes(request.url)) {
      const token = this.localStorageService.getAuthToken();

      if (!token) {
        return request;
      }

      return request.clone({
        headers: request.headers.set(this.AUTH_HEADER, `Token ${token}`),
      });
    } else {
      return request;
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    request = this.addAuthenticationToken(request);

    return next.handle(request);
  }
}
