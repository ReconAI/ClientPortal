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
import { Store, select, ActionsSubject } from '@ngrx/store';
import { loginUserRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-sign-in-form-container',
  templateUrl: './sign-in-form.container.html',
})
export class SignInFormContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>, // it's used to close our modal when it's need to do
    private actionsSubject: ActionsSubject
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectLoginLoadingStatus)
  );

  loginError$: Observable<string> = this.store.pipe(
    select(selectLoginErrorsStatus)
  );

  closeModal$ = this.actionsSubject.pipe(
    ofType(preResetPasswordSucceededAction),
    tap(() => 'im here, email')
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(resetLoginUserErrorAction());
  }

  clickSubmit(user: LoginUserFormInterface): void {
    this.store.dispatch(loginUserRequestedAction(user));
  }
}
