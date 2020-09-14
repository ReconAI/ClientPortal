import { ReportPortalMainComponent } from './components/report-portal-main/report-portal-main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportingDeviceContainer } from './components/reporting-list-devices/reporting-device/reporting-device.container';
import { ReportingListDevicesContainer } from './components/reporting-list-devices/reporting-list-devices.container';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ' ',
      backgroundWithoutUnion: true,
    },
    component: ReportPortalMainComponent,
  },
  {
    path: ':id',
    data: {
      breadcrumbId: '%reporting-device-id',
      breadcrumbTitle: '...',
      backgroundWithoutUnion: true,
      showBreadcrumbs: true,
    },
    component: ReportingDeviceContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
