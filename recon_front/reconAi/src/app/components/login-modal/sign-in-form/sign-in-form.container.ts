import { selectLoginErrorsStatus } from './../../../store/user/user.selectors';
import { tap } from 'rxjs/operators';
import {
  loginUserSucceededAction,
  resetLoginUserErrorAction,
  preResetPasswordSucceededAction,
  preResetPasswordErrorAction,
} from './../../../store/user/user.actions';
import { ofType } from '@ngrx/effects';
import { selectLoginLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { Observable, Subscription } from 'rxjs';
import { LoginUserFormInterface } from './../../../store/user/user.server.helpers';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store, select } from '@ngrx/store';
import { loginUserRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-sign-in-form-container',
  templateUrl: './sign-in-form.container.html',
})
export class SignInFormContainer implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectLoginLoadingStatus)
  );

  loginError$: Observable<string> = this.store.pipe(
    select(selectLoginErrorsStatus)
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(resetLoginUserErrorAction());
  }

  clickSubmit(user: LoginUserFormInterface): void {
    this.store.dispatch(loginUserRequestedAction(user));
  }
}
