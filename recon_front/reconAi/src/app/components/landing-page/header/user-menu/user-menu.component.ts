import { Subscription, Observable } from 'rxjs';
import { LoginModalComponent } from './../../../login-modal/login-modal.component';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { UserRolesPriorities } from 'app/constants/types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'recon-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit, OnDestroy {
  readonly userRolePriorities = UserRolesPriorities;

  @Input() userPriority: UserRolesPriorities;
  @Input() closeModalEvent$: Observable<any>; // check type
  @Input() userName: string;
  @Input() userRole: string;

  @Output() logout$ = new EventEmitter();
  constructor(public dialog: MatDialog) {}
  dialogRef: MatDialogRef<any>; // check type
  subscriptionToCloseModal$: Subscription;

  openDialog(): void {
    this.dialogRef = this.dialog.open(LoginModalComponent, {
      width: '460px',
      height: '410px',
      panelClass: 'login-modal'
    });
  }

  logout(): void {
    this.logout$.emit({});
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // check whether we should close modal window after sign in or sign up
    if (this.closeModalEvent$) {
      this.subscriptionToCloseModal$ = this.closeModalEvent$.subscribe(() => {
        this.closeDialog();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionToCloseModal$) {
      this.subscriptionToCloseModal$.unsubscribe();
    }
  }
}
