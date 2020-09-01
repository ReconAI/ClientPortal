import { ObjectFormErrorInterface } from './../../constants/types/requests';
import { FilterItemInterface } from './../../reporting/constants/types/filters';
import {
  PaginationRequestInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
import { createAction, props } from '@ngrx/store';
import {
  ReportingDeviceClientInterface,
  SetSelectedReportingDeviceClientInterface,
  SetGpsRequestInterface,
} from './reporting.server.helpers';

export enum ReportingActionTypes {
  LOAD_REPORTING_DEVICE_LIST_REQUESTED = '[Reporting] Load Reporting Device List Requested',
  LOAD_REPORTING_DEVICE_LIST_SUCCEEDED = '[Reporting] Load Reporting Device List Succeeded',
  LOAD_REPORTING_DEVICE_LIST_ERROR = '[Reporting] Load Reporting Device List Error',

  LOAD_REPORTING_DEVICE_REQUESTED = '[Reporting] Load Reporting Device Requested',
  LOAD_REPORTING_DEVICE_SUCCEEDED = '[Reporting] Load Reporting Device Succeeded',
  LOAD_REPORTING_DEVICE_ERROR = '[Reporting] Load Reporting Device Error',

  SET_USER_FILTERS = '[Reporting] Set User Filters',
  RESET_USER_FILTERS = '[Reporting] Reset User Filters',

  SET_GPS_REQUESTED = '[Reporting] Set Gps Requested',
  SET_GPS_SUCCEEDED = '[Reporting] Set Gps Succeeded',
  SET_GPS_ERROR = '[Reporting] Set Gps Error',
  RESET_SET_GPS_ERROR = '[Reporting] Reset Set Gps Error',
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

export interface SetUserFiltersPayloadInterface {
  filters: FilterItemInterface[];
}

export const setUserFiltersAction = createAction(
  ReportingActionTypes.SET_USER_FILTERS,
  props<SetUserFiltersPayloadInterface>()
);

export const resetUserFiltersAction = createAction(
  ReportingActionTypes.RESET_USER_FILTERS
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
  ReportingActionTypes.RESET_SET_GPS_ERROR,
);
