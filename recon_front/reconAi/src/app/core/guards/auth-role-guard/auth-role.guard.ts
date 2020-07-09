import {
  selectIsAuthenticated,
  selectUserRolePriority,
} from './../../../store/user/user.selectors';

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleGuard implements CanActivate, CanActivateChild {
  constructor(private store: Store<AppState>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.pipe(
      select(selectIsAuthenticated),
      filter((isAuth) => isAuth !== null),
      withLatestFrom(this.store.pipe(select(selectUserRolePriority))),
      map(
        ([isAuth, userRolePriority]) =>
          isAuth &&
          (!next?.data?.expectedRolePriority ||
            userRolePriority >= next?.data?.expectedRolePriority)
      )
    );
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(next, state);
  }
}
