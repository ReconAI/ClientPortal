import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingListDevicesComponent } from './components/reporting-list-devices/reporting-list-devices.component';
import { ReportingListDevicesContainer } from './components/reporting-list-devices/reporting-list-devices.container';
import { ReportingFilterComponent } from './components/reporting-filter/reporting-filter.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    ReportingListDevicesComponent,
    ReportingListDevicesContainer,
    ReportingFilterComponent,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ],
})
export class ReportingModule {}
