import { isValueOfFilterValidForServer } from './../../core/helpers/filters';
import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { SensorClientInterface } from './../../constants/types/sensors';
import { LatLngInterface } from 'app/core/helpers/markers';
import { ReconSelectOption } from './../../shared/types/recon-select';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { MetaClientInterface } from './../../constants/types/requests';
import {
  ReportingFilteringDeviceClientInterface,
  HeatMapPointClientInterface,
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

export const selectReportingSensorAdditionalInfo = createSelector(
  selectReporting,
  (reporting: ReportingState): SensorClientInterface =>
    reporting?.sensorAdditionalInfo || null
);

export const selectReportingSensorAdditionalInfoLat = createSelector(
  selectReportingSensorAdditionalInfo,
  (sensor: SensorClientInterface): number => +sensor?.lat || 0
);

export const selectReportingSensorAdditionalInfoLng = createSelector(
  selectReportingSensorAdditionalInfo,
  (sensor: SensorClientInterface): number => +sensor?.lng || 0
);

export const selectReportingSensorAdditionalInfoSerial = createSelector(
  selectReportingSensorAdditionalInfo,
  (sensor: SensorClientInterface): number => sensor?.serial || null
);

export const selectSingularDeviceFilters = createSelector(
  selectReporting,
  (reporting: ReportingState): FilterItemInterface[] =>
    reporting?.singularDeviceFilters?.filter((filter) =>
      isValueOfFilterValidForServer(filter, false)
    ) || []
);

export const selectFilteredSingularDeviceFilters = createSelector(
  selectReporting,
  (reporting: ReportingState): FilterItemInterface[] =>
    reporting?.singularDeviceFilters?.filter((filter) =>
      isValueOfFilterValidForServer(filter)
    ) || []
);
