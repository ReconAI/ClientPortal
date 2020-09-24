import { FilterItemInterface } from 'app/reporting/constants/types/filters';
import { SensorClientInterface } from './../../constants/types/sensors';
import { RelevantDataExportFormat } from './../../constants/types/relevant-data';
import { ReconSelectOption } from './../../shared/types/recon-select';
import { ObjectFormErrorInterface } from './../../constants/types/requests';

import {
  PaginationRequestInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
import { createAction, props } from '@ngrx/store';
import {
  ReportingFilteringDeviceClientInterface,
  SetGpsRequestInterface,
  OptionsPayloadInterface,
  AutocompleteNameServerInterface,
  AutocompleteNameClientInterface,
  BuildRouteClientInterface,
  HeatMapDataClientInterface,
  SensorClientActionInterface,
  SensorClientRequestedActionInterface,
} from './reporting.server.helpers';

export enum ReportingActionTypes {
  LOAD_REPORTING_FILTERING_LIST_REQUESTED = '[Reporting] Load Reporting Filtering List Requested',
  LOAD_REPORTING_FILTERING_LIST_SUCCEEDED = '[Reporting] Load Reporting Filtering List Succeeded',
  LOAD_REPORTING_FILTERING_LIST_ERROR = '[Reporting] Load Reporting Filtering List Error',
  RESET_REPORTING_FILTERING_LIST_ERROR = '[Reporting] Reset Reporting Filtering List Error',

  LOAD_REPORTING_DEVICE_REQUESTED = '[Reporting] Load Reporting Device Requested',
  LOAD_REPORTING_DEVICE_SUCCEEDED = '[Reporting] Load Reporting Device Succeeded',
  LOAD_REPORTING_DEVICE_ERROR = '[Reporting] Load Reporting Device Error',
  RESET_REPORTING_DEVICE_ERROR = '[Reporting] Reset Reporting Device Error',

  SET_APPLY_FILTERS_STATUS = '[Reporting] Set Apply Filters Status',

  SET_GPS_REQUESTED = '[Reporting] Set Gps Requested',
  SET_GPS_SUCCEEDED = '[Reporting] Set Gps Succeeded',
  SET_GPS_ERROR = '[Reporting] Set Gps Error',
  RESET_SET_GPS_ERROR = '[Reporting] Reset Set Gps Error',

  EVENT_OBJECT_LIST_REQUESTED = '[Reporting] Event Object List Requested',
  EVENT_OBJECT_LIST_SUCCEEDED = '[Reporting] Event Object List Succeeded',
  EVENT_OBJECT_LIST_ERROR = '[Reporting] Event Object List Error',

  PROJECT_NAME_LIST_REQUESTED = '[Reporting] Project Name List Requested',
  PROJECT_NAME_LIST_SUCCEEDED = '[Reporting] Project Name List Succeeded',
  PROJECT_NAME_LIST_ERROR = '[Reporting] Project Name List Error',

  ROAD_WEATHER_CONDITION_LIST_REQUESTED = '[Reporting] Road Weather Condition List Requested',
  ROAD_WEATHER_CONDITION_LIST_SUCCEEDED = '[Reporting] Road Weather Condition List Succeeded',
  ROAD_WEATHER_CONDITION_LIST_ERROR = '[Reporting] Road Weather Condition List Error',

  VEHICLE_TYPE_LIST_REQUESTED = '[Reporting] Vehicle Type List Requested',
  VEHICLE_TYPE_LIST_SUCCEEDED = '[Reporting] Vehicle Type List Succeeded',
  VEHICLE_TYPE_LIST_ERROR = '[Reporting] Vehicle Type List List Error',

  EXPORT_RELEVANT_DATA_REQUESTED = '[Reporting] Export Relevant Data Requested',
  EXPORT_RELEVANT_DATA_SUCCEEDED = '[Reporting] Export Relevant Data Succeeded',
  EXPORT_RELEVANT_DATA_ERROR = '[Reporting] Export Relevant Data Error',

  BUILD_VEHICLE_ROUTE_REQUESTED = '[Reporting] Build Vehicle Route Requested',
  BUILD_VEHICLE_ROUTE_SUCCEEDED = '[Reporting] Build Vehicle Route Succeeded',
  BUILD_VEHICLE_ROUTE_ERROR = '[Reporting] Build Vehicle Route Error',

  HEAT_MAP_DATA_REQUESTED = '[Reporting] Heat Map Data Requested',
  HEAT_MAP_DATA_SUCCEEDED = '[Reporting] Heat Map Data Succeeded',
  HEAT_MAP_DATA_ERROR = '[Reporting] Heat Map Data Error',
  RESET_HEAT_MAP_DATA = '[Reporting] Reset Heat Map Data',

  PLATE_NUMBER_LIST_REQUESTED = '[Reporting] Plate Number List Requested',
  PLATE_NUMBER_LIST_SUCCEEDED = '[Reporting] Plate Number List Succeeded',
  PLATE_NUMBER_LIST_ERROR = '[Reporting] Plate Number List Error',

  PEDESTRIAN_FLOW_LIST_REQUESTED = '[Reporting] Pedestrian Flow List Requested',
  PEDESTRIAN_FLOW_LIST_SUCCEEDED = '[Reporting] Pedestrian Flow List Succeeded',
  PEDESTRIAN_FLOW_LIST_ERROR = '[Reporting] Pedestrian Flow List Error',

  LOAD_ADDITIONAL_SENSOR_INFO_REQUESTED = '[Reporting] Load Additional Sensor Info Requested',
  LOAD_ADDITIONAL_SENSOR_INFO_SUCCEEDED = '[Reporting] Load Additional Sensor Info Succeeded',
  LOAD_ADDITIONAL_SENSOR_INFO_ERROR = '[Reporting] Load Additional Sensor Info Error',

  SET_SINGULAR_DEVICE_FILTERS = '[Reporting] Set Singular Device Filters',
}

export const loadReportingFilteringListRequestedAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_FILTERING_LIST_REQUESTED,
  props<PaginationRequestInterface>()
);

export const loadReportingFilteringListSucceededAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_FILTERING_LIST_SUCCEEDED,
  props<
    PaginationResponseClientInterface<ReportingFilteringDeviceClientInterface>
  >()
);

export const loadReportingFilteringListErrorAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_FILTERING_LIST_ERROR,
  props<ObjectFormErrorInterface>()
);
export interface LoadReportingDevicePayloadInterface {
  id: number;
  page: number;
}

export const loadReportingDeviceRequestedAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_REQUESTED,
  props<LoadReportingDevicePayloadInterface>()
);

export const loadReportingDeviceSucceededAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_SUCCEEDED,
  props<
    PaginationResponseClientInterface<ReportingFilteringDeviceClientInterface>
  >()
);

export const loadReportingDeviceErrorAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_ERROR,
  props<ObjectFormErrorInterface>()
);

export interface SetApplyFiltersStatusPayloadInterface {
  status: boolean;
}

export const setApplyFiltersStatusAction = createAction(
  ReportingActionTypes.SET_APPLY_FILTERS_STATUS,
  props<SetApplyFiltersStatusPayloadInterface>()
);

export const setGpsRequestedAction = createAction(
  ReportingActionTypes.SET_GPS_REQUESTED,
  props<SetGpsRequestInterface>()
);

export const setGpsSucceededAction = createAction(
  ReportingActionTypes.SET_GPS_SUCCEEDED
);

export const setGpsErrorAction = createAction(
  ReportingActionTypes.SET_GPS_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetSetGpsErrorAction = createAction(
  ReportingActionTypes.RESET_SET_GPS_ERROR
);

export const eventObjectListRequestedAction = createAction(
  ReportingActionTypes.EVENT_OBJECT_LIST_REQUESTED
);

export const eventObjectListSucceededAction = createAction(
  ReportingActionTypes.EVENT_OBJECT_LIST_SUCCEEDED,
  props<OptionsPayloadInterface>()
);

export const eventObjectListErrorAction = createAction(
  ReportingActionTypes.EVENT_OBJECT_LIST_ERROR
);

export const projectNameListRequestedAction = createAction(
  ReportingActionTypes.PROJECT_NAME_LIST_REQUESTED,
  props<AutocompleteNameServerInterface>()
);

export const projectNameListSucceededAction = createAction(
  ReportingActionTypes.PROJECT_NAME_LIST_SUCCEEDED,
  props<AutocompleteNameClientInterface>()
);

export const projectNameListErrorAction = createAction(
  ReportingActionTypes.PROJECT_NAME_LIST_ERROR
);

export const roadWeatherConditionListRequestedAction = createAction(
  ReportingActionTypes.ROAD_WEATHER_CONDITION_LIST_REQUESTED
);

export const roadWeatherConditionListSucceededAction = createAction(
  ReportingActionTypes.ROAD_WEATHER_CONDITION_LIST_SUCCEEDED,
  props<OptionsPayloadInterface>()
);

export const roadWeatherConditionListErrorAction = createAction(
  ReportingActionTypes.ROAD_WEATHER_CONDITION_LIST_ERROR
);

export const vehicleTypeListRequestedAction = createAction(
  ReportingActionTypes.VEHICLE_TYPE_LIST_REQUESTED
);

export const vehicleTypeListSucceededAction = createAction(
  ReportingActionTypes.VEHICLE_TYPE_LIST_SUCCEEDED,
  props<OptionsPayloadInterface>()
);

export const vehicleTypeListErrorAction = createAction(
  ReportingActionTypes.VEHICLE_TYPE_LIST_ERROR
);

export interface ExportRelevantDataPayloadInterface {
  format: RelevantDataExportFormat;
}

export const exportRelevantDataRequestedAction = createAction(
  ReportingActionTypes.EXPORT_RELEVANT_DATA_REQUESTED,
  props<ExportRelevantDataPayloadInterface>()
);

export const exportRelevantDataSucceededAction = createAction(
  ReportingActionTypes.EXPORT_RELEVANT_DATA_SUCCEEDED
);

export const exportRelevantDataErrorAction = createAction(
  ReportingActionTypes.EXPORT_RELEVANT_DATA_ERROR
);

export const buildVehicleRouteRequestedAction = createAction(
  ReportingActionTypes.BUILD_VEHICLE_ROUTE_REQUESTED
);

export const buildVehicleRouteSucceededAction = createAction(
  ReportingActionTypes.BUILD_VEHICLE_ROUTE_SUCCEEDED,
  props<BuildRouteClientInterface>()
);

export const buildVehicleRouteErrorAction = createAction(
  ReportingActionTypes.BUILD_VEHICLE_ROUTE_ERROR
);

export interface HeatMapDataRequestedActionInterface {
  isForDevice: boolean;
}

export const heatMapDataRequestedAction = createAction(
  ReportingActionTypes.HEAT_MAP_DATA_REQUESTED,
  props<HeatMapDataRequestedActionInterface>()
);

export const heatMapDataSucceededAction = createAction(
  ReportingActionTypes.HEAT_MAP_DATA_SUCCEEDED,
  props<HeatMapDataClientInterface>()
);

export const heatMapDataErrorAction = createAction(
  ReportingActionTypes.HEAT_MAP_DATA_ERROR
);

export const plateNumberListRequestedAction = createAction(
  ReportingActionTypes.PLATE_NUMBER_LIST_REQUESTED,
  props<AutocompleteNameServerInterface>()
);

export const plateNumberListSucceededAction = createAction(
  ReportingActionTypes.PLATE_NUMBER_LIST_SUCCEEDED,
  props<AutocompleteNameClientInterface>()
);

export const plateNumberListErrorAction = createAction(
  ReportingActionTypes.PLATE_NUMBER_LIST_SUCCEEDED
);

export const pedestrianFlowListRequestedAction = createAction(
  ReportingActionTypes.PEDESTRIAN_FLOW_LIST_REQUESTED
);

export const pedestrianFlowListSucceededAction = createAction(
  ReportingActionTypes.PEDESTRIAN_FLOW_LIST_SUCCEEDED,
  props<OptionsPayloadInterface>()
);

export const pedestrianFlowListErrorAction = createAction(
  ReportingActionTypes.PEDESTRIAN_FLOW_LIST_ERROR
);

export const resetMapDataAction = createAction(
  ReportingActionTypes.RESET_HEAT_MAP_DATA
);

export const loadAdditionalSensorInfoRequestedAction = createAction(
  ReportingActionTypes.LOAD_ADDITIONAL_SENSOR_INFO_REQUESTED,
  props<SensorClientRequestedActionInterface>()
);

export const loadAdditionalSensorInfoSucceededAction = createAction(
  ReportingActionTypes.LOAD_ADDITIONAL_SENSOR_INFO_SUCCEEDED,
  props<SensorClientActionInterface>()
);

export const loadAdditionalSensorInfoErrorAction = createAction(
  ReportingActionTypes.LOAD_ADDITIONAL_SENSOR_INFO_ERROR
);

export interface SetSingularDeviceFiltersInterface {
  filters: FilterItemInterface[];
}

export const setSingularDeviceFiltersAction = createAction(
  ReportingActionTypes.SET_SINGULAR_DEVICE_FILTERS,
  props<SetSingularDeviceFiltersInterface>()
);

export const resetReportingFilteringListErrorAction = createAction(
  ReportingActionTypes.RESET_REPORTING_FILTERING_LIST_ERROR
);

export const resetReportingDeviceErrorAction = createAction(
  ReportingActionTypes.RESET_REPORTING_DEVICE_ERROR
);
