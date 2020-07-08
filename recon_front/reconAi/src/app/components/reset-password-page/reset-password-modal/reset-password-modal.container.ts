import { Subscription } from 'rxjs';
import { ModalCloseSubscriptionInterface } from './../../../constants/types/modals';
import { ofType } from '@ngrx/effects';
import { selectResetPasswordError } from './../../../store/user/user.selectors';
import { selectResetPasswordLoadingStatus } from './../../../store/loaders/loaders.selectors';
import {
  resetPasswordRequestedAction,
  resetResetPasswordErrorAction,
  resetPasswordSucceededAction,
} from './../../../store/user/user.actions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ResetPasswordInterface,
  PasswordMetaInterface,
} from './../../../constants/types/resetPassword';

import { AppState } from './../../../store/reducers/index';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'recon-reset-password-modal-container',
  templateUrl: './reset-password-modal.container.html',
})
export class ResetPasswordModalContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA)
    public data: PasswordMetaInterface & ModalCloseSubscriptionInterface
  ) {}
  subscriptionToClose$: Subscription;

  resetPasswordLoadingStatus$ = this.store.pipe(
    select(selectResetPasswordLoadingStatus)
  );

  passwordsError$ = this.store.pipe(select(selectResetPasswordError));

  ngOnInit(): void {
    this.subscriptionToClose$ = this.data.subscriptionToClose$;
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetResetPasswordErrorAction());

    if (this.subscriptionToClose$) {
      this.subscriptionToClose$.unsubscribe();
    }
  }

  sendPassword(passwords: ResetPasswordInterface): void {
    this.store.dispatch(
      resetPasswordRequestedAction({
        ...passwords,
        token: this.data.token,
        uidb64: this.data.uidb64,
      })
    );
  }
}
