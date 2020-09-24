import { filter, map, withLatestFrom, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import {
  selectIsUserAbleToBuy,
  selectIsAuthenticated,
} from 'app/store/user/user.selectors';

@Injectable({
  providedIn: 'root',
})
export class IsPossibleToBuyGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.pipe(
      withLatestFrom(
        this.store.pipe(select(selectIsAuthenticated)),
        this.store.pipe(select(selectIsUserAbleToBuy))
      ),
      // ([store, isAuth, isAbleToBuy])
      filter(([_, isAuth]) => isAuth !== null),
      map(([_, isAuth, isAbleToBuy]) => isAbleToBuy),
      tap((isAbleToBuy) => {
        if (!isAbleToBuy) {
          this.router.navigate(['']);
        }
      })
    );
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(next, state);
  }
}
