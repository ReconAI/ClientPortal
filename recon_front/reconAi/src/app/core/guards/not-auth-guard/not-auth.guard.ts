import { filter, map, tap, take } from 'rxjs/operators';
import { selectIsNotAuthenticated } from './../../../store/user/user.selectors';
import { AppState } from './../../../store/reducers/index';
import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    return this.store.pipe(
      select(selectIsNotAuthenticated),
      filter((isNotAuth) => isNotAuth !== null),
      take(1),
      tap((isNotAuth) => {
        if (!isNotAuth) {
          this.router.navigate(['']);
        }
      })
      // check it later
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    return this.canActivate(next, state);
  }
}
