import { LatLngInterface } from 'app/core/helpers/markers';
import { ReconSelectOption } from './../../shared/types/recon-select';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { MetaClientInterface } from './../../constants/types/requests';
import { ReportingDeviceClientInterface } from './reporting.server.helpers';
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { ReportingState } from './reporting.reducer';

export const selectReporting = (state: AppState): ReportingState =>
  state.reporting;

export const selectReportingDeviceList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReportingDeviceClientInterface[] =>
    reporting.list
);

export const selectReportingDeviceListMeta = createSelector(
  selectReporting,
  (reporting: ReportingState): MetaClientInterface => reporting?.meta
);

export const selectReportingDeviceListMetaCurrentPage = createSelector(
  selectReportingDeviceListMeta,
  (meta: MetaClientInterface): number => meta?.currentPage
);

export const selectReportingDeviceListMetaCount = createSelector(
  selectReportingDeviceListMeta,
  (meta: MetaClientInterface): number => meta?.count
);

export const selectReportingDeviceListMetaPageSize = createSelector(
  selectReportingDeviceListMeta,
  (meta: MetaClientInterface): number => meta?.pageSize
);

export const selectReportingSelectedDeviceList = createSelector(
  selectReporting,
  (reporting: ReportingState): ReportingDeviceClientInterface[] =>
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
