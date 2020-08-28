import { PaginationRequestInterface } from './../../../constants/types/requests';
import {
  selectReportingDeviceList,
  selectReportingDeviceListMetaCurrentPage,
  selectReportingDeviceListMetaCount,
  selectReportingDeviceListMetaPageSize,
} from './../../../store/reporting/reporting.selectors';
import { ReportingDeviceClientInterface } from './../../../store/reporting/reporting.server.helpers';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { loadReportingDeviceListRequestedAction } from 'app/store/reporting';
import { Observable } from 'rxjs';
import { selectReportingDeviceListLoadingStatus } from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-reporting-list-devices-container',
  templateUrl: './reporting-list-devices.container.html',
})
export class ReportingListDevicesContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  reportingDeviceList$: Observable<
    ReportingDeviceClientInterface[]
  > = this.store.pipe(select(selectReportingDeviceList));

  currentPage$: Observable<number> = this.store.pipe(
    select(selectReportingDeviceListMetaCurrentPage)
  );
  count$: Observable<number> = this.store.pipe(
    select(selectReportingDeviceListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectReportingDeviceListMetaPageSize)
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
