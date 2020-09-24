import { Subscription } from 'rxjs';
import { ResetPasswordModalContainer } from './reset-password-modal/reset-password-modal.container';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store } from '@ngrx/store';
import { setAuthStatusAction } from 'app/store/user';

@Component({
  selector: 'recon-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.less'],
})
export class ResetPasswordPageComponent implements OnInit {
  uidb64: string;
  token: string;
  dialogRef: MatDialogRef<ResetPasswordModalContainer>;
  subscriptionToClose$: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) {}

  openDialog(): void {
    this.dialogRef = this.dialog.open(ResetPasswordModalContainer, {
      width: '460px',
      height: '330px',
      data: {
        uidb64: this.uidb64,
        token: this.token,
      },
    });
  }

  ngOnInit(): void {
    this.uidb64 = this.activatedRoute.snapshot.paramMap.get('uidb');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');

    this.store.dispatch(
      setAuthStatusAction({
        status: false,
      })
    );
    if (this.uidb64 && this.token) {
      this.openDialog();
    }
  }
}
