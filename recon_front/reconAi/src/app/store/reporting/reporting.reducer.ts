import { LatLngInterface } from 'app/core/helpers/markers';
import { ReconSelectOption } from 'app/shared/types';
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
  OptionsPayloadInterface,
  AutocompleteNameClientInterface,
  BuildRouteClientInterface,
  HeatMapPointClientInterface,
  HeatMapDataClientInterface,
} from './reporting.server.helpers';
import {
  loadReportingDeviceListSucceededAction,
  loadReportingDeviceSucceededAction,
  setGpsErrorAction,
  resetSetGpsErrorAction,
  SetApplyFiltersStatusPayloadInterface,
  setApplyFiltersStatusAction,
  eventObjectListRequestedAction,
  eventObjectListSucceededAction,
  projectNameListSucceededAction,
  roadWeatherConditionListSucceededAction,
  vehicleTypeListRequestedAction,
  vehicleTypeListSucceededAction,
  buildVehicleRouteSucceededAction,
  heatMapDataSucceededAction,
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
  applyFilters: boolean;
  eventObjects: ReconSelectOption[];
  vehicleTypes: ReconSelectOption[];
  roadWeatherConditions: ReconSelectOption[];
  projectNames: string[];
  routePoints: LatLngInterface[];
  heatMapData: HeatMapPointClientInterface[];
}

export const initialState: ReportingState = {
  list: [],
  meta: null,
  selectedDevice: {
    list: [],
    meta: null,
  },
  errors: reportingErrorsInitialization,
  applyFilters: false,
  eventObjects: [],
  vehicleTypes: [],
  roadWeatherConditions: [],
  projectNames: [],
  routePoints: [],
  heatMapData: [],
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

const resetSetGpsErrorReducer = (state: ReportingState): ReportingState => ({
  ...state,
  errors: {
    ...state.errors,
    setGps: reportingErrorsInitialization.setGps,
  },
});

const setApplyFiltersStatusReducer = (
  state: ReportingState,
  { type, status }: SetApplyFiltersStatusPayloadInterface & Action
): ReportingState => ({
  ...state,
  applyFilters: status,
});

const eventObjectListSucceededReducer = (
  state: ReportingState,
  { options }: OptionsPayloadInterface
): ReportingState => ({
  ...state,
  eventObjects: options,
});

const roadWeatherConditionListSucceededReducer = (
  state: ReportingState,
  { options }: OptionsPayloadInterface
): ReportingState => ({
  ...state,
  roadWeatherConditions: options,
});

const vehicleTypeListSucceededReducer = (
  state: ReportingState,
  { options }: OptionsPayloadInterface
): ReportingState => ({
  ...state,
  vehicleTypes: options,
});

const projectNameListSucceededReducer = (
  state: ReportingState,
  { names }: AutocompleteNameClientInterface
): ReportingState => ({
  ...state,
  projectNames: names,
});

const buildVehicleRouteSucceededReducer = (
  state: ReportingState,
  { points }: BuildRouteClientInterface
): ReportingState => ({
  ...state,
  routePoints: points,
});

const heatMapDataSucceededReducer = (
  state: ReportingState,
  { points }: HeatMapDataClientInterface
): ReportingState => ({
  ...state,
  heatMapData: points,
});

const reportingReducer = createReducer(
  initialState,
  on(
    loadReportingDeviceListSucceededAction,
    loadReportingDeviceListSucceededReducer
  ),
  on(loadReportingDeviceSucceededAction, loadReportingDeviceSucceededReducer),
  on(setGpsErrorAction, setGpsErrorReducer),
  on(resetSetGpsErrorAction, resetSetGpsErrorReducer),
  on(setApplyFiltersStatusAction, setApplyFiltersStatusReducer),
  on(eventObjectListSucceededAction, eventObjectListSucceededReducer),
  on(projectNameListSucceededAction, projectNameListSucceededReducer),
  on(
    roadWeatherConditionListSucceededAction,
    roadWeatherConditionListSucceededReducer
  ),
  on(vehicleTypeListSucceededAction, vehicleTypeListSucceededReducer),
  on(buildVehicleRouteSucceededAction, buildVehicleRouteSucceededReducer),
  on(heatMapDataSucceededAction, heatMapDataSucceededReducer)
);

export function reducer(state: ReportingState | undefined, action: Action) {
  return reportingReducer(state, action);
}
