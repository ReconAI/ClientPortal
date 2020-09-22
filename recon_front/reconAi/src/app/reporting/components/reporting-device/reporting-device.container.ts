import { FiltersService } from './../../../core/services/filters/filters.service';
import {
  buildVehicleRouteRequestedAction,
  buildVehicleRouteSucceededAction,
  heatMapDataRequestedAction,
  plateNumberListSucceededAction,
  projectNameListSucceededAction,
  resetMapDataAction,
  setApplyFiltersStatusAction,
  setSingularDeviceFiltersAction,
} from './../../../store/reporting/reporting.actions';
import { LatLngInterface } from 'app/core/helpers/markers';
import {
  selectReportingSelectedDeviceList,
  selectReportingSelectedDeviceListMetaCurrentPage,
  selectReportingSelectedDeviceListMetaCount,
  selectReportingSelectedDeviceListMetaPageSize,
  selectVehicleRoutePoints,
  selectHeatMapData,
  selectReportingSensorAdditionalInfoLat,
  selectReportingSensorAdditionalInfoLng,
} from './../../../store/reporting/reporting.selectors';
import {
  selectReportingDeviceLoadingStatus,
  selectBuildingRouteStatus,
  selectHeatMapLoadingStatus,
} from './../../../store/loaders/loaders.selectors';
import {
  ReportingFilteringDeviceClientInterface,
  HeatMapPointClientInterface,
} from './../../../store/reporting/reporting.server.helpers';
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
  selectedDeviceList: ReportingFilteringDeviceClientInterface[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store<AppState>,
    private filtersService: FiltersService
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingDeviceLoadingStatus)
  );

  selectedDeviceList$: Observable<
    ReportingFilteringDeviceClientInterface[]
  > = this.store.pipe(select(selectReportingSelectedDeviceList));
  selectedDeviceListSubscription$: Subscription;

  buildingLoading$: Observable<boolean> = this.store.pipe(
    select(selectBuildingRouteStatus)
  );

  routePoints$: Observable<LatLngInterface[]> = this.store.pipe(
    select(selectVehicleRoutePoints)
  );

  heatMapData$: Observable<HeatMapPointClientInterface[]> = this.store.pipe(
    select(selectHeatMapData)
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
  heatMapLoading$: Observable<boolean> = this.store.pipe(
    select(selectHeatMapLoadingStatus)
  );

  currentDeviceLat$: Observable<number> = this.store.pipe(
    select(selectReportingSensorAdditionalInfoLat)
  );

  currentDeviceLng$: Observable<number> = this.store.pipe(
    select(selectReportingSensorAdditionalInfoLng)
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
    this.store.dispatch(setSingularDeviceFiltersAction({ filters: [] }));

    this.store.dispatch(
      setApplyFiltersStatusAction({
        status: false,
      })
    );
    this.store.dispatch(projectNameListSucceededAction({ names: [] }));
    this.store.dispatch(plateNumberListSucceededAction({ names: [] }));
    this.store.dispatch(buildVehicleRouteSucceededAction({ points: [] }));
  }

  buildRoute(): void {
    this.store.dispatch(buildVehicleRouteRequestedAction());
  }

  loadHeatMapData(): void {
    this.store.dispatch(heatMapDataRequestedAction({ isForDevice: true }));
  }

  resetMapData(): void {
    this.store.dispatch(resetMapDataAction());
  }
}
