import { SharedModule } from './../shared/shared.module';
import { ManagementContainer } from './components/management/management.container';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ManagementComponent } from './components/management/management.component';


@NgModule({
  declarations: [ManagementComponent, ManagementContainer],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
