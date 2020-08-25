import {
  MetaClientInterface,
  PaginationResponseClientInterface,
} from './../../constants/types/requests';
import { createReducer, Action, on } from '@ngrx/store';
import {
  ReportingDeviceClientInterface,
  SetSelectedReportingDeviceClientInterface,
} from './reporting.server.helpers';
import {
  loadReportingDeviceListSucceededAction,
  loadReportingDeviceSucceededAction,
} from './reporting.actions';

export interface ReportingState {
  list: ReportingDeviceClientInterface[];
  meta: MetaClientInterface;
  selectedDevice: ReportingDeviceClientInterface;
}

export const initialState: ReportingState = {
  list: [],
  meta: null,
  selectedDevice: null,
};

const loadReportingDeviceListSucceededReducer = (
  state: ReportingState,
  {
    type,
    ...payload
  }: Action & PaginationResponseClientInterface<ReportingDeviceClientInterface>
): ReportingState => ({ ...state, list: payload.list, meta: payload.meta });

const setChosenReportingDeviceReducer = (
  state: ReportingState,
  { type, device }: Action & SetSelectedReportingDeviceClientInterface
): ReportingState => ({ ...state, selectedDevice: device });

const loadReportingDeviceSucceededReducer = (
  state: ReportingState,
  { type, device }: Action & SetSelectedReportingDeviceClientInterface
): ReportingState => ({ ...state, selectedDevice: device });

const reportingReducer = createReducer(
  initialState,
  on(
    loadReportingDeviceListSucceededAction,
    loadReportingDeviceListSucceededReducer
  ),
  on(loadReportingDeviceSucceededAction, loadReportingDeviceSucceededReducer)
);

export function reducer(state: ReportingState | undefined, action: Action) {
  return reportingReducer(state, action);
}
