import { filter, map, tap, take } from 'rxjs/operators';
import { selectIsNotAuthenticated } from './../../../store/user/user.selectors';
import { AppState } from './../../../store/reducers/index';
import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
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
      select(selectIsNotAuthenticated),
      filter((isAuth) => isAuth !== null)

      // check it later
    );
  }
}
