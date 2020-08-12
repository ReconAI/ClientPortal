import { ReportingDeviceContainer } from './components/reporting-device/reporting-device.container';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportingListDevicesContainer } from './components/reporting-list-devices/reporting-list-devices.container';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ' ',
      backgroundWithoutUnion: true,
    },
    component: ReportingListDevicesContainer,
  },
  {
    path: ':id',
    component: ReportingDeviceContainer,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
