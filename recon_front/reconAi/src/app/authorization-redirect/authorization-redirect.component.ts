import { Router } from '@angular/router';
import { selectIsAuthenticated } from './../store/user/user.selectors';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';

@Component({
  selector: 'recon-authorization-redirect',
  templateUrl: './authorization-redirect.component.html',
  styleUrls: ['./authorization-redirect.component.less'],
})
export class AuthorizationRedirectComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>, private router: Router) {}

  isUserAuth$: Observable<boolean> = this.store.pipe(
    select(selectIsAuthenticated)
  );
  isAuthSubscription$: Subscription;

  ngOnInit(): void {
    this.isAuthSubscription$ = this.isUserAuth$.subscribe((isAuth) => {
      this.router.navigate([isAuth ? 'reporting' : 'unauthorized']);
    });
  }

  ngOnDestroy(): void {
    this?.isAuthSubscription$?.unsubscribe();
  }
}
