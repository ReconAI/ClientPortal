import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportingDeviceContainer } from './components/reporting-device/reporting-device.container';
import { ReportingFilteringListContainer } from './components/reporting-filtering-list/reporting-filtering-list.container';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Report portal',
      backgroundWithoutUnion: true,
    },
    component: ReportingFilteringListContainer,
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
