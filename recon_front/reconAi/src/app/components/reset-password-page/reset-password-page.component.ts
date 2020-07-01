import { ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { ResetPasswordModalContainer } from './reset-password-modal/reset-password-modal.container';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AppState } from './../../store/reducers/index';
import { Store, ActionsSubject } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { resetPasswordSucceededAction } from 'app/store/user';

@Component({
  selector: 'recon-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.less'],
})
export class ResetPasswordPageComponent implements OnInit {
  uidb64: string;
  token: string;
  dialogRef: MatDialogRef<any>; // check type
  subscriptionToClose$: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private actionsSubject: ActionsSubject
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(ResetPasswordModalContainer, {
      width: '460px',
      height: '330px',
      data: {
        uidb64: this.uidb64,
        token: this.token,
        subscriptionToClose$: this.subscriptionToClose$,
      },
    });
  }

  ngOnInit(): void {
    this.uidb64 = this.activatedRoute.snapshot.paramMap.get('uidb');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');

    this.router.navigate(['/']);
    this.subscriptionToClose$ = this.actionsSubject
      .pipe(ofType(resetPasswordSucceededAction))
      .subscribe(() => {
        this.closeDialog();
      });

    if (this.uidb64 && this.token) {
      this.openDialog();
    }
  }
}
