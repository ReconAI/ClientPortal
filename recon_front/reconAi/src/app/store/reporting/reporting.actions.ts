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

  SET_CHOSEN_REPORTING_DEVICE = '[Reporting] Set Chosen Reporting Device',
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

export const setChosenReportingDeviceAction = createAction(
  ReportingActionTypes.SET_CHOSEN_REPORTING_DEVICE,
  props<SetSelectedReportingDeviceClientInterface>()
);
