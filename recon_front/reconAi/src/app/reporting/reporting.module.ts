import { ReportingDeviceContainer } from './components/reporting-device/reporting-device.container';

import { CoreModule } from './../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingFilterComponent } from './components/reporting-filter/reporting-filter.component';
import { SharedModule } from 'app/shared/shared.module';
import { SetGpsDialogComponent } from './components/set-gps-dialog/set-gps-dialog.component';
import { SetGpsDialogContainer } from './components/set-gps-dialog/set-gps-dialog.container';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { OnlineStreamingComponent } from './components/online-streaming/online-streaming.component';
import { ReportingFilterContainer } from './components/reporting-filter/reporting-filter.container';
import { ReportingFilterGpsComponent } from './components/reporting-filter-gps/reporting-filter-gps.component';
import { SetBoundsDialogComponent } from './components/reporting-filter-gps/set-bounds-dialog/set-bounds-dialog.component';
import { ExportRelevantDataSuccessDialogComponent } from './components/export-relevant-data-success-dialog/export-relevant-data-success-dialog.component';
import { ReportingFilteringListComponent } from './components/reporting-filtering-list/reporting-filtering-list.component';
import { ReportingFilteringListContainer } from './components/reporting-filtering-list/reporting-filtering-list.container';

import { SensorAdditionalInfoComponent } from './components/reporting-filtering-list/sensor-additional-info/sensor-additional-info.component';
import { SensorAdditionalInfoContainer } from './components/reporting-filtering-list/sensor-additional-info/sensor-additional-info.container';
@NgModule({
  declarations: [
    ReportingFilterComponent,
    ReportingFilterContainer,
    SetGpsDialogComponent,
    SetGpsDialogContainer,
    ReportingDeviceContainer,
    OnlineStreamingComponent,
    ReportingFilterGpsComponent,
    SetBoundsDialogComponent,
    ExportRelevantDataSuccessDialogComponent,
    ReportingFilteringListComponent,
    ReportingFilteringListContainer,
    SensorAdditionalInfoComponent,
    SensorAdditionalInfoContainer,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    LeafletModule,
    LeafletDrawModule,
    CoreModule,
  ],
})
export class ReportingModule {}
