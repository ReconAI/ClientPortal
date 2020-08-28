import { FilterItemInterface } from './../../reporting/constants/types/filters';
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
  setUserFiltersAction,
  SetUserFiltersPayloadInterface,
} from './reporting.actions';

export interface ReportingState {
  list: ReportingDeviceClientInterface[];
  meta: MetaClientInterface;
  selectedDevice: ReportingDeviceClientInterface;
  filters: FilterItemInterface[];
}

export const initialState: ReportingState = {
  list: [],
  meta: null,
  selectedDevice: null,
  filters: [],
};

const loadReportingDeviceListSucceededReducer = (
  state: ReportingState,
  {
    type,
    ...payload
  }: Action & PaginationResponseClientInterface<ReportingDeviceClientInterface>
): ReportingState => ({ ...state, list: payload.list, meta: payload.meta });

const loadReportingDeviceSucceededReducer = (
  state: ReportingState,
  { type, device }: Action & SetSelectedReportingDeviceClientInterface
): ReportingState => ({ ...state, selectedDevice: device });

const setUserFiltersReducer = (
  state: ReportingState,
  { type, filters }: Action & SetUserFiltersPayloadInterface
): ReportingState => ({ ...state, filters });

const reportingReducer = createReducer(
  initialState,
  on(
    loadReportingDeviceListSucceededAction,
    loadReportingDeviceListSucceededReducer
  ),
  on(loadReportingDeviceSucceededAction, loadReportingDeviceSucceededReducer),
  on(setUserFiltersAction, setUserFiltersReducer)
);

export function reducer(state: ReportingState | undefined, action: Action) {
  return reportingReducer(state, action);
}
