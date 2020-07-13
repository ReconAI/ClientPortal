import { ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { preSignUpUserSucceededAction } from './../../store/signUp/signUp.actions';
import { loginUserSucceededAction } from './../../store/user/user.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

@Component({
  selector: 'recon-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginModalComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private actionsSubject: ActionsSubject
  ) {}

  closeModal$ = this.actionsSubject.pipe(
    ofType(loginUserSucceededAction, preSignUpUserSucceededAction)
  );

  subscriptionToCloseModal$: Subscription;

  ngOnInit(): void {
    this.subscriptionToCloseModal$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionToCloseModal$) {
      this.subscriptionToCloseModal$.unsubscribe();
    }
  }
}
