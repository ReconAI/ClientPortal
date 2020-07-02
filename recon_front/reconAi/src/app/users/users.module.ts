import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ManagementComponent } from './components/management/management.component';


@NgModule({
  declarations: [ManagementComponent],
  imports: [
    CommonModule,
    MaterialModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
