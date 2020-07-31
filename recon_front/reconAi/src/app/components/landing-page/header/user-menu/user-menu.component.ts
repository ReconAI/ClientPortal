import { Subscription, Observable } from 'rxjs';
import { LoginModalComponent } from './../../../login-modal/login-modal.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserRolesPriorities } from 'app/constants/types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { loadUsersListRequestedAction } from 'app/store/users';
import { Router } from '@angular/router';

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
  @Input() isUserAbleToBuy = false;

  @Output() logout$ = new EventEmitter();
  constructor(public dialog: MatDialog, private router: Router) {}
  dialogRef: MatDialogRef<LoginModalComponent>;

  openDialog(): void {
    this.dialogRef = this.dialog.open(LoginModalComponent, {
      width: '460px',
      height: '410px',
      panelClass: 'login-modal',
    });
  }

  onNavigate(...url: string[]): void {
    this.router.navigate([...url]);
  }

  logout(): void {
    this.logout$.emit();
  }
}
