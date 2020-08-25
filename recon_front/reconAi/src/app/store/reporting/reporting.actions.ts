import {
  PaginationRequestInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
import { createAction, props } from '@ngrx/store';
import {
  ReportingDeviceClientInterface,
  SetSelectedReportingDeviceClientInterface,
} from './reporting.server.helpers';

export enum ReportingActionTypes {
  LOAD_REPORTING_DEVICE_LIST_REQUESTED = '[Reporting] Load Reporting Device List Requested',
  LOAD_REPORTING_DEVICE_LIST_SUCCEEDED = '[Reporting] Load Reporting Device List Succeeded',
  LOAD_REPORTING_DEVICE_LIST_ERROR = '[Reporting] Load Reporting Device List Error',

  LOAD_REPORTING_DEVICE_REQUESTED = '[Reporting] Load Reporting Device Requested',
  LOAD_REPORTING_DEVICE_SUCCEEDED = '[Reporting] Load Reporting Device Succeeded',
  LOAD_REPORTING_DEVICE_ERROR = '[Reporting] Load Reporting Device Error',
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
}

export const loadReportingDeviceRequestedAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_REQUESTED,
  props<LoadReportingDevicePayloadInterface>()
);

export const loadReportingDeviceSucceededAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_SUCCEEDED,
  props<SetSelectedReportingDeviceClientInterface>()
);

export const loadReportingDeviceErrorAction = createAction(
  ReportingActionTypes.LOAD_REPORTING_DEVICE_ERROR
);
