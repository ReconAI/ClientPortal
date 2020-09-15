import { loadReportingDeviceListRequestedAction } from './../../../store/reporting/reporting.actions';
import { Observable } from 'rxjs';
import { SensorClientInterface } from './../../../store/reporting/reporting.server.helpers';
import { AppState } from './../../../store/reducers/index';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  selectReportingSensorList,
  selectReportingSensorListMetaCount,
  selectReportingSensorListMetaCurrentPage,
  selectReportingSensorListMetaPageSize,
} from 'app/store/reporting/reporting.selectors';
import { selectReportingDeviceListLoadingStatus } from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-sensors-list-container',
  templateUrl: './sensors-list.container.html',
})
export class SensorsListContainer implements OnInit {
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
