import { LatLngInterface } from 'app/core/helpers/markers';
import { ReconSelectOption } from './../../shared/types/recon-select';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { MetaClientInterface } from './../../constants/types/requests';
import {
  ReportingFilteringDeviceClientInterface,
  HeatMapPointClientInterface,
  SensorClientInterface,
} from './reporting.server.helpers';
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { ReportingState } from './reporting.reducer';

export const selectReporting = (state: AppState): ReportingState =>
  state.reporting;

export const selectReportingFilteringList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReportingFilteringDeviceClientInterface[] =>
    reporting.list
);

export const selectReportingFilteringListMeta = createSelector(
  selectReporting,
  (reporting: ReportingState): MetaClientInterface => reporting?.meta
);

export const selectReportingFilteringListMetaCurrentPage = createSelector(
  selectReportingFilteringListMeta,
  (meta: MetaClientInterface): number => meta?.currentPage
);

export const selectReportingFilteringListMetaCount = createSelector(
  selectReportingFilteringListMeta,
  (meta: MetaClientInterface): number => meta?.count
);

export const selectReportingFilteringListMetaPageSize = createSelector(
  selectReportingFilteringListMeta,
  (meta: MetaClientInterface): number => meta?.pageSize
);

export const selectReportingSelectedDeviceList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReportingFilteringDeviceClientInterface[] =>
    reporting?.selectedDevice?.list || []
);

export const selectReportingSelectedDeviceListMeta = createSelector(
  selectReporting,
  (reporting: ReportingState): MetaClientInterface =>
    reporting.selectedDevice?.meta
);

export const selectReportingSelectedDeviceListMetaCurrentPage = createSelector(
  selectReportingSelectedDeviceListMeta,
  (meta: MetaClientInterface): number => meta?.currentPage
);

export const selectReportingSelectedDeviceListMetaCount = createSelector(
  selectReportingSelectedDeviceListMeta,
  (meta: MetaClientInterface): number => meta?.count
);

export const selectReportingSelectedDeviceListMetaPageSize = createSelector(
  selectReportingSelectedDeviceListMeta,
  (meta: MetaClientInterface): number => meta?.pageSize
);

export const selectSetGpsError = createSelector(
  selectReporting,
  (reporting: ReportingState): FormServerErrorInterface | null =>
    reporting?.errors?.setGps
);

export const selectApplyFiltersStatus = createSelector(
  selectReporting,
  (reporting: ReportingState): boolean => !!reporting?.applyFilters
);

export const selectEventObjectList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReconSelectOption[] =>
    reporting?.eventObjects || []
);

export const selectRoadWeatherConditionList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReconSelectOption[] =>
    reporting?.roadWeatherConditions || []
);

export const selectProjectNameList = createSelector(
  selectReporting,
  (reporting: ReportingState): string[] => reporting?.projectNames || []
);

export const selectVehicleTypeList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReconSelectOption[] =>
    reporting?.vehicleTypes || []
);

export const selectVehicleRoutePoints = createSelector(
  selectReporting,
  (reporting: ReportingState): LatLngInterface[] => reporting?.routePoints || []
);

export const selectHeatMapData = createSelector(
  selectReporting,
  (reporting: ReportingState): HeatMapPointClientInterface[] =>
    reporting?.heatMapData || []
);

export const selectPlateNumberList = createSelector(
  selectReporting,
  (reporting: ReportingState): string[] => reporting?.plateNumbers || []
);

export const selectPedestrianFlowList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReconSelectOption[] =>
    reporting?.pedestrianFlowList || []
);

export const selectReportingSensorList = createSelector(
  selectReporting,
  (reporting: ReportingState): SensorClientInterface[] =>
    reporting?.sensors?.list || []
);

export const selectReportingSensorListMeta = createSelector(
  selectReporting,
  (reporting: ReportingState): MetaClientInterface => reporting.sensors?.meta
);

export const selectReportingSensorListMetaCurrentPage = createSelector(
  selectReportingSensorListMeta,
  (meta: MetaClientInterface): number => meta?.currentPage
);

export const selectReportingSensorListMetaCount = createSelector(
  selectReportingSensorListMeta,
  (meta: MetaClientInterface): number => meta?.count
);

export const selectReportingSensorListMetaPageSize = createSelector(
  selectReportingSensorListMeta,
  (meta: MetaClientInterface): number => meta?.pageSize
);
