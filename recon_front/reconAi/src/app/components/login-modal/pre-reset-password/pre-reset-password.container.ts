import { preResetResetPasswordErrorAction } from './../../../store/user/user.actions';
import { selectPreResetPasswordLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { setPreResetPasswordLoadingStatusAction } from './../../../store/loaders/loaders.actions';
import { selectPreResetPasswordError } from './../../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreResetPasswordRequestInterface } from 'app/store/user/user.server.helpers';
import { AppState } from 'app/store/reducers';
import { preResetPasswordRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-pre-reset-password-container',
  templateUrl: './pre-reset-password.container.html',
})
export class PreResetPasswordContainer implements OnInit, OnDestroy {
  preResetError$: Observable<string> = this.store.pipe(
    select(selectPreResetPasswordError)
  );

  preResetLoadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectPreResetPasswordLoadingStatus)
  );

  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(preResetResetPasswordErrorAction());
  }

  sendEmail(data: PreResetPasswordRequestInterface): void {
    this.store.dispatch(preResetPasswordRequestedAction(data));
  }
}
