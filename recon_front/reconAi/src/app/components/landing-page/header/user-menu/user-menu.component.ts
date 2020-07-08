import { Subscription, Observable } from 'rxjs';
import { LoginModalComponent } from './../../../login-modal/login-modal.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserRolesPriorities } from 'app/constants/types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { loadUsersListRequestedAction } from 'app/store/users';

@Component({
  selector: 'recon-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less'],
})
export class UserMenuComponent {
  readonly userRolePriorities = UserRolesPriorities;

  @Input() userPriority: UserRolesPriorities;
  @Input() userName: string;
  @Input() userRole: string;

  @Output() logout$ = new EventEmitter();
  constructor(public dialog: MatDialog) {}
  dialogRef: MatDialogRef<LoginModalComponent>;

  openDialog(): void {
    this.dialogRef = this.dialog.open(LoginModalComponent, {
      width: '460px',
      height: '410px',
      panelClass: 'login-modal',
    });
  }

  logout(): void {
    this.logout$.emit();
  }
}
