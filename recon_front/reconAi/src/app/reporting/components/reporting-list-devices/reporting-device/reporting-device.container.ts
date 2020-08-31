import {
  selectReportingSelectedDeviceList,
  selectReportingSelectedDeviceListMetaCurrentPage,
  selectReportingSelectedDeviceListMetaCount,
  selectReportingSelectedDeviceListMetaPageSize,
} from './../../../../store/reporting/reporting.selectors';
import { selectReportingDeviceLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { ReportingDeviceClientInterface } from './../../../../store/reporting/reporting.server.helpers';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'app/store/reducers';
import { loadReportingDeviceRequestedAction } from 'app/store/reporting';

@Component({
  selector: 'recon-reporting-device-container',
  templateUrl: './reporting-device.container.html',
})
export class ReportingDeviceContainer implements OnInit, OnDestroy {
  id: number;
  selectedDeviceList: ReportingDeviceClientInterface[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingDeviceLoadingStatus)
  );

  selectedDeviceList$: Observable<
    ReportingDeviceClientInterface[]
  > = this.store.pipe(select(selectReportingSelectedDeviceList));
  selectedDeviceListSubscription$: Subscription;

  currentPage$: Observable<number> = this.store.pipe(
    select(selectReportingSelectedDeviceListMetaCurrentPage)
  );
  count$: Observable<number> = this.store.pipe(
    select(selectReportingSelectedDeviceListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectReportingSelectedDeviceListMetaPageSize)
  );

  loadDevices(page: number = 1): void {
    this.store.dispatch(
      loadReportingDeviceRequestedAction({ id: this.id, page })
    );
  }

  ngOnInit(): void {
    this.id = +this.activateRoute.snapshot.paramMap.get('id');
    this.selectedDeviceListSubscription$ = this.selectedDeviceList$.subscribe(
      (devices) => {
        this.selectedDeviceList = devices;
      }
    );
    this.loadDevices();
  }

  ngOnDestroy(): void {
    this.selectedDeviceListSubscription$.unsubscribe();
  }
}
