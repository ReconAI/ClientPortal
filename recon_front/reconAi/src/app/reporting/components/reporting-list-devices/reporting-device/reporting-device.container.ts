import { FiltersService } from './../../../../core/services/filters/filters.service';
import { buildVehicleRouteRequestedAction } from './../../../../store/reporting/reporting.actions';
import { LatLngInterface } from 'app/core/helpers/markers';
import {
  selectReportingSelectedDeviceList,
  selectReportingSelectedDeviceListMetaCurrentPage,
  selectReportingSelectedDeviceListMetaCount,
  selectReportingSelectedDeviceListMetaPageSize,
  selectVehicleRoutePoints,
} from './../../../../store/reporting/reporting.selectors';
import {
  selectReportingDeviceLoadingStatus,
  selectBuildingRouteStatus,
} from './../../../../store/loaders/loaders.selectors';
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
    private store: Store<AppState>,
    private filtersService: FiltersService
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingDeviceLoadingStatus)
  );

  selectedDeviceList$: Observable<
    ReportingDeviceClientInterface[]
  > = this.store.pipe(select(selectReportingSelectedDeviceList));
  selectedDeviceListSubscription$: Subscription;

  buildingLoading$: Observable<boolean> = this.store.pipe(
    select(selectBuildingRouteStatus)
  );

  routePoints$: Observable<LatLngInterface[]> = this.store.pipe(
    select(selectVehicleRoutePoints)
  );

  isPlatNumberApplied$: Observable<
    boolean
  > = this.filtersService.isFilterAppliedForCurrentUser('license_plate_number');

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

  buildRoute(): void {
    this.store.dispatch(buildVehicleRouteRequestedAction());
  }
}
