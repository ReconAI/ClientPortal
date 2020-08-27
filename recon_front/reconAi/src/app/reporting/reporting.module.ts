import { ReportingDeviceContainer } from './components/reporting-list-devices/reporting-device/reporting-device.container';

import { CoreModule } from './../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingListDevicesComponent } from './components/reporting-list-devices/reporting-list-devices.component';
import { ReportingListDevicesContainer } from './components/reporting-list-devices/reporting-list-devices.container';
import { ReportingFilterComponent } from './components/reporting-filter/reporting-filter.component';
import { SharedModule } from 'app/shared/shared.module';
import { SetGpsDialogComponent } from './components/set-gps-dialog/set-gps-dialog.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { OnlineStreamingComponent } from './components/reporting-list-devices/online-streaming/online-streaming.component';
import { ReportingFilterContainer } from './components/reporting-filter/reporting-filter.container';
@NgModule({
  declarations: [
    ReportingListDevicesComponent,
    ReportingListDevicesContainer,
    ReportingFilterComponent,
    ReportingFilterContainer,
    SetGpsDialogComponent,
    ReportingDeviceContainer,
    OnlineStreamingComponent,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    LeafletModule,
    CoreModule,
  ],
})
export class ReportingModule {}
