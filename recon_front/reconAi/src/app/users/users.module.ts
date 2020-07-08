import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserComponent } from './components/user/user.component';
import { SharedModule } from './../shared/shared.module';
import { ManagementContainer } from './components/management/management.container';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ManagementComponent } from './components/management/management.component';
import { UserContainer } from './components/user/user.container';
import { DeleteUserDialogComponent } from './components/management/delete-user-dialog/delete-user-dialog.component';
import { DeleteUserDialogContainer } from './components/management/delete-user-dialog/delete-user-dialog.container';

@NgModule({
  declarations: [
    UserComponent,
    ManagementComponent,
    ManagementContainer,
    UserContainer,
    DeleteUserDialogComponent,
    DeleteUserDialogContainer
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    UsersRoutingModule,
    SharedModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class UsersModule {}
