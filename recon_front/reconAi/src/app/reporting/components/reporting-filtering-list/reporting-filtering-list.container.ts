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
  resetMapDataAction,
} from './../../../store/reporting/reporting.actions';
import { RelevantDataExportFormat } from './../../../constants/types/relevant-data';
import {
  selectReportingFilteringList,
  selectReportingFilteringListMetaCurrentPage,
  selectReportingFilteringListMetaCount,
  selectReportingFilteringListMetaPageSize,
  selectVehicleRoutePoints,
  selectHeatMapData,
} from './../../../store/reporting/reporting.selectors';
import {
  ReportingFilteringDeviceClientInterface,
  HeatMapPointClientInterface,
} from './../../../store/reporting/reporting.server.helpers';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { loadReportingFilteringListRequestedAction } from 'app/store/reporting';
import { Observable, Subscription } from 'rxjs';
import { selectReportingFilteringListLoadingStatus } from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-reporting-filtering-list-container',
  templateUrl: './reporting-filtering-list.container.html',
})
export class ReportingFilteringListContainer implements OnInit {
  constructor(
    private store: Store<AppState>,
    private filtersService: FiltersService
  ) {}

  reportingDeviceList$: Observable<
    ReportingFilteringDeviceClientInterface[]
  > = this.store.pipe(select(selectReportingFilteringList));

  currentPage$: Observable<number> = this.store.pipe(
    select(selectReportingFilteringListMetaCurrentPage)
  );

  isPlatNumberApplied$: Observable<
    boolean
  > = this.filtersService.isFilterAppliedForCurrentUser('license_plate_number');

  count$: Observable<number> = this.store.pipe(
    select(selectReportingFilteringListMetaCount)
  );
  pageSize$: Observable<number> = this.store.pipe(
    select(selectReportingFilteringListMetaPageSize)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectReportingFilteringListLoadingStatus)
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
    this.store.dispatch(loadReportingFilteringListRequestedAction({ page }));
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
      loadReportingFilteringListRequestedAction({
        page: 1,
      })
    );
  }

  resetMapData(): void {
    this.store.dispatch(resetMapDataAction());
  }
}
