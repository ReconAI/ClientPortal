import { ReconSelectOption } from './../../shared/types/recon-select';
import { ObjectFormErrorInterface } from './../../constants/types/requests';
import {
  FilterItemInterface,
  OptionServerInterface,
} from './../../reporting/constants/types/filters';
import {
  PaginationRequestInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
import { createAction, props } from '@ngrx/store';
import {
  ReportingDeviceClientInterface,
  SetGpsRequestInterface,
  OptionsPayloadInterface,
  AutocompleteNameServerInterface,
  AutocompleteNameClientInterface,
} from './reporting.server.helpers';

export enum ReportingActionTypes {
  LOAD_REPORTING_DEVICE_LIST_REQUESTED = '[Reporting] Load Reporting Device List Requested',
  LOAD_REPORTING_DEVICE_LIST_SUCCEEDED = '[Reporting] Load Reporting Device List Succeeded',
  LOAD_REPORTING_DEVICE_LIST_ERROR = '[Reporting] Load Reporting Device List Error',

  LOAD_REPORTING_DEVICE_REQUESTED = '[Reporting] Load Reporting Device Requested',
  LOAD_REPORTING_DEVICE_SUCCEEDED = '[Reporting] Load Reporting Device Succeeded',
  LOAD_REPORTING_DEVICE_ERROR = '[Reporting] Load Reporting Device Error',

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
}

export const loadReportingDeviceListRequestedAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_LIST_REQUESTED,
  props<PaginationRequestInterface>()
);

export const loadReportingDeviceListSucceededAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_LIST_SUCCEEDED,
  props<PaginationResponseClientInterface<ReportingDeviceClientInterface>>()
);

export const loadReportingDeviceListErrorAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_LIST_ERROR
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
  props<PaginationResponseClientInterface<ReportingDeviceClientInterface>>()
);

export const loadReportingDeviceErrorAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_ERROR
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
