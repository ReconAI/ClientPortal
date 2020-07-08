import { ofType } from '@ngrx/effects';
import { MatDialogRef } from '@angular/material/dialog';
import {
  preResetResetPasswordErrorAction,
  preResetPasswordSucceededAction,
} from './../../../store/user/user.actions';
import { selectPreResetPasswordLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { selectPreResetPasswordError } from './../../../store/user/user.selectors';
import { Observable, Subscription } from 'rxjs';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { PreResetPasswordRequestInterface } from 'app/store/user/user.server.helpers';
import { AppState } from 'app/store/reducers';
import { preResetPasswordRequestedAction } from 'app/store/user';

@Component({
  selector: 'recon-pre-reset-password-container',
  templateUrl: './pre-reset-password.container.html',
})
export class PreResetPasswordContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private actionsSubject: ActionsSubject,
    private dialogRef: MatDialogRef<PreResetPasswordContainer>
  ) {}
  subscriptionToClose$: Subscription;

  preResetError$: Observable<string> = this.store.pipe(
    select(selectPreResetPasswordError)
  );

  preResetLoadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectPreResetPasswordLoadingStatus)
  );

  closeModal$ = this.actionsSubject.pipe(
    ofType(preResetPasswordSucceededAction)
  );

  ngOnInit(): void {
    this.subscriptionToClose$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }

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
