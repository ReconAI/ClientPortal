import { Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { selectResetPasswordError } from './../../../store/user/user.selectors';
import { selectResetPasswordLoadingStatus } from './../../../store/loaders/loaders.selectors';
import {
  resetPasswordRequestedAction,
  resetResetPasswordErrorAction,
  resetPasswordSucceededAction,
} from './../../../store/user/user.actions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ResetPasswordInterface,
  ActivationInterface,
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
    public data: ActivationInterface,
    private dialogRef: MatDialogRef<ResetPasswordModalContainer>,
    private actionsSubject: ActionsSubject
  ) {}
  subscriptionToClose$: Subscription;

  resetPasswordLoadingStatus$ = this.store.pipe(
    select(selectResetPasswordLoadingStatus)
  );

  passwordsError$ = this.store.pipe(select(selectResetPasswordError));
  closeModal$ = this.actionsSubject.pipe(ofType(resetPasswordSucceededAction));
  ngOnInit(): void {
    this.subscriptionToClose$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
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
