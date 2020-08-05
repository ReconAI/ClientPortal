import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingListDevicesComponent } from './components/reporting-list-devices/reporting-list-devices.component';
import { ReportingListDevicesContainer } from './components/reporting-list-devices/reporting-list-devices.container';

@NgModule({
  declarations: [ReportingListDevicesComponent, ReportingListDevicesContainer],
  imports: [CommonModule, ReportingRoutingModule],
})
export class ReportingModule {}
