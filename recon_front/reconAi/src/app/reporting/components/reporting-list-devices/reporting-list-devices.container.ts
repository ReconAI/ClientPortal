import { selectReportingDeviceListLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { loadReportingDeviceListRequestedAction } from './../../../store/reporting/reporting.actions';
import {
  selectReportingSensorList,
  selectReportingSensorListMetaCurrentPage,
  selectReportingSensorListMetaCount,
  selectReportingSensorListMetaPageSize,
} from './../../../store/reporting/reporting.selectors';
import { SensorClientInterface } from './../../../store/reporting/reporting.server.helpers';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'recon-reporting-list-devices-container',
  templateUrl: './reporting-list-devices.container.html',
})
export class ReportingListDevicesContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  sensorsList$: Observable<SensorClientInterface[]> = this.store.pipe(
    select(selectReportingSensorList)
  );

  currentPage$: Observable<number> = this.store.pipe(
    select(selectReportingSensorListMetaCurrentPage)
  );

  count$: Observable<number> = this.store.pipe(
    select(selectReportingSensorListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectReportingSensorListMetaPageSize)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingDeviceListLoadingStatus)
  );

  loadDevices(page: number): void {
    this.store.dispatch(loadReportingDeviceListRequestedAction({ page }));
  }

  ngOnInit(): void {
    this.store.dispatch(
      loadReportingDeviceListRequestedAction({
        page: 1,
      })
    );
  }
}
