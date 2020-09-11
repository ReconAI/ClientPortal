import { LatLngInterface } from './../../../core/helpers/markers';
import { map, withLatestFrom } from 'rxjs/operators';
import { selectUserProfileId } from './../../../store/users/users.selectors';
import { FiltersService } from './../../../core/services/filters/filters.service';
import {
  selectExportRelevantDataStatus,
  selectBuildingRouteStatus,
  selectHeatMapLoadingStatus,
} from './../../../store/loaders/loaders.selectors';
import {
  exportRelevantDataRequestedAction,
  buildVehicleRouteRequestedAction,
  heatMapDataRequestedAction,
} from './../../../store/reporting/reporting.actions';
import { RelevantDataExportFormat } from './../../../constants/types/relevant-data';
import {
  selectReportingDeviceList,
  selectReportingDeviceListMetaCurrentPage,
  selectReportingDeviceListMetaCount,
  selectReportingDeviceListMetaPageSize,
  selectVehicleRoutePoints,
  selectHeatMapData,
} from './../../../store/reporting/reporting.selectors';
import {
  ReportingDeviceClientInterface,
  HeatMapPointClientInterface,
} from './../../../store/reporting/reporting.server.helpers';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { loadReportingDeviceListRequestedAction } from 'app/store/reporting';
import { Observable, Subscription } from 'rxjs';
import { selectReportingDeviceListLoadingStatus } from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-reporting-list-devices-container',
  templateUrl: './reporting-list-devices.container.html',
})
export class ReportingListDevicesContainer implements OnInit {
  constructor(
    private store: Store<AppState>,
    private filtersService: FiltersService
  ) {}

  reportingDeviceList$: Observable<
    ReportingDeviceClientInterface[]
  > = this.store.pipe(select(selectReportingDeviceList));

  currentPage$: Observable<number> = this.store.pipe(
    select(selectReportingDeviceListMetaCurrentPage)
  );

  isPlatNumberApplied$: Observable<
    boolean
  > = this.filtersService.isFilterAppliedForCurrentUser('license_plate_number');

  count$: Observable<number> = this.store.pipe(
    select(selectReportingDeviceListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectReportingDeviceListMetaPageSize)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingDeviceListLoadingStatus)
  );
  buildingLoading$: Observable<boolean> = this.store.pipe(
    select(selectBuildingRouteStatus)
  );
  exportingStatus$: Observable<boolean> = this.store.pipe(
    select(selectExportRelevantDataStatus)
  );
  heatMapLoading$: Observable<boolean> = this.store.pipe(
    select(selectHeatMapLoadingStatus)
  );

  routePoints$: Observable<LatLngInterface[]> = this.store.pipe(
    select(selectVehicleRoutePoints)
  );

  heatMapData$: Observable<HeatMapPointClientInterface[]> = this.store.pipe(
    select(selectHeatMapData)
  );

  loadDevices(page: number): void {
    this.store.dispatch(loadReportingDeviceListRequestedAction({ page }));
  }

  exportRelevantData(exportType: RelevantDataExportFormat): void {
    this.store.dispatch(
      exportRelevantDataRequestedAction({
        format: exportType,
      })
    );
  }

  buildRoute(): void {
    this.store.dispatch(buildVehicleRouteRequestedAction());
  }

  loadHeatMapData(): void {
    this.store.dispatch(heatMapDataRequestedAction({ isForDevice: false }));
  }

  ngOnInit(): void {
    this.store.dispatch(
      loadReportingDeviceListRequestedAction({
        page: 1,
      })
    );
  }
}
