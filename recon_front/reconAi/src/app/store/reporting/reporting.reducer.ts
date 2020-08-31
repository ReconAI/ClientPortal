import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from 'app/constants/types/requests';
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
  setGpsErrorAction,
  resetSetGpsErrorAction,
} from './reporting.actions';

export interface ReportingErrorsInterface {
  setGps: FormServerErrorInterface;
}

const reportingErrorsInitialization: ReportingErrorsInterface = {
  setGps: null,
};

export interface ReportingState {
  list: ReportingDeviceClientInterface[];
  meta: MetaClientInterface;
  selectedDevice: {
    list: ReportingDeviceClientInterface[];
    meta: MetaClientInterface;
  };
  errors: ReportingErrorsInterface;
  filters: FilterItemInterface[];
}

export const initialState: ReportingState = {
  list: [],
  meta: null,
  selectedDevice: {
    list: [],
    meta: null,
  },
  errors: reportingErrorsInitialization,
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
  {
    type,
    list,
    meta,
  }: Action & PaginationResponseClientInterface<ReportingDeviceClientInterface>
): ReportingState => ({
  ...state,
  selectedDevice: {
    list,
    meta,
  },
});

const setGpsErrorReducer = (
  state: ReportingState,
  { type, errors }: ObjectFormErrorInterface & Action
): ReportingState => ({
  ...state,
  errors: {
    ...state.errors,
    setGps: errors,
  },
});

const resetSetGpsErrorReducer = (
  state: ReportingState,
  { type, errors }: ObjectFormErrorInterface & Action
): ReportingState => ({
  ...state,
  errors: {
    ...state.errors,
    setGps: reportingErrorsInitialization.setGps,
  },
});

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
  on(setUserFiltersAction, setUserFiltersReducer),
  on(setGpsErrorAction, setGpsErrorReducer),
  on(resetSetGpsErrorAction, resetSetGpsErrorReducer)
);

export function reducer(state: ReportingState | undefined, action: Action) {
  return reportingReducer(state, action);
}
