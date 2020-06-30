import { ModalCloseSubscriptionInterface } from './../../../constants/types/modals';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { preResetResetPasswordErrorAction } from './../../../store/user/user.actions';
import { selectPreResetPasswordLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { setPreResetPasswordLoadingStatusAction } from './../../../store/loaders/loaders.actions';
import { selectPreResetPasswordError } from './../../../store/user/user.selectors';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { PreResetPasswordRequestInterface } from 'app/store/user/user.server.helpers';
import { AppState } from 'app/store/reducers';
import { preResetPasswordRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-pre-reset-password-container',
  templateUrl: './pre-reset-password.container.html',
})
export class PreResetPasswordContainer implements OnInit, OnDestroy {
  subscriptionToClose$: Subscription;

  preResetError$: Observable<string> = this.store.pipe(
    select(selectPreResetPasswordError)
  );

  preResetLoadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectPreResetPasswordLoadingStatus)
  );

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: ModalCloseSubscriptionInterface
  ) {
    this.subscriptionToClose$ = data.subscriptionToClose$;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(preResetResetPasswordErrorAction());
    if (this.subscriptionToClose$) {
      this.subscriptionToClose$.unsubscribe();
    }
  }

  sendEmail(data: PreResetPasswordRequestInterface): void {
    this.store.dispatch(preResetPasswordRequestedAction(data));
  }
}
