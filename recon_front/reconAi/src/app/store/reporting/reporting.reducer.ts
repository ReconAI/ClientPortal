import { SensorClientInterface } from './../../constants/types/sensors';
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
  ReportingFilteringDeviceClientInterface,
  OptionsPayloadInterface,
  AutocompleteNameClientInterface,
  BuildRouteClientInterface,
  HeatMapPointClientInterface,
  HeatMapDataClientInterface,
  SensorClientActionInterface,
} from './reporting.server.helpers';
import {
  loadReportingFilteringListSucceededAction,
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
  plateNumberListSucceededAction,
  pedestrianFlowListSucceededAction,
  resetMapDataAction,
  loadAdditionalSensorInfoSucceededAction,
  SetSingularDeviceFiltersInterface,
  setSingularDeviceFiltersAction,
} from './reporting.actions';

export interface ReportingErrorsInterface {
  setGps: FormServerErrorInterface;
}

const reportingErrorsInitialization: ReportingErrorsInterface = {
  setGps: null,
};

export interface ReportingState {
  // TO DO: Throw to object
  list: ReportingFilteringDeviceClientInterface[];
  meta: MetaClientInterface;
  selectedDevice: {
    list: ReportingFilteringDeviceClientInterface[];
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
  plateNumbers: string[];
  pedestrianFlowList: ReconSelectOption[];
  sensors: {
    list: SensorClientInterface[];
    meta: MetaClientInterface;
  };
  sensorAdditionalInfo: SensorClientInterface;
  singularDeviceFilters: FilterItemInterface[];
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
  plateNumbers: [],
  pedestrianFlowList: [],
  sensors: {
    list: [],
    meta: null,
  },
  sensorAdditionalInfo: null,
  singularDeviceFilters: [],
};

const loadReportingFilteringListSucceededReducer = (
  state: ReportingState,
  {
    type,
    ...payload
  }: Action &
    PaginationResponseClientInterface<ReportingFilteringDeviceClientInterface>
): ReportingState => ({ ...state, list: payload.list, meta: payload.meta });

const loadReportingDeviceSucceededReducer = (
  state: ReportingState,
  {
    type,
    list,
    meta,
  }: Action &
    PaginationResponseClientInterface<ReportingFilteringDeviceClientInterface>
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

const plateNumberListSucceededReducer = (
  state: ReportingState,
  { names }: AutocompleteNameClientInterface
): ReportingState => ({
  ...state,
  plateNumbers: names,
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

const pedestrianFlowListSucceededReducer = (
  state: ReportingState,
  { options }: OptionsPayloadInterface
): ReportingState => ({
  ...state,
  pedestrianFlowList: options,
});

const loadAdditionalSensorInfoSucceededReducer = (
  state: ReportingState,
  { sensor }: Action & SensorClientActionInterface
): ReportingState => ({
  ...state,
  sensorAdditionalInfo: sensor,
});

const resetMapDataReducer = (state: ReportingState): ReportingState => ({
  ...state,
  heatMapData: [],
});

const setSingularDeviceFiltersReducer = (
  state: ReportingState,
  { filters }: Action & SetSingularDeviceFiltersInterface
): ReportingState => ({
  ...state,
  singularDeviceFilters: filters,
});

const reportingReducer = createReducer(
  initialState,
  on(
    loadReportingFilteringListSucceededAction,
    loadReportingFilteringListSucceededReducer
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
  on(heatMapDataSucceededAction, heatMapDataSucceededReducer),
  on(plateNumberListSucceededAction, plateNumberListSucceededReducer),
  on(pedestrianFlowListSucceededAction, pedestrianFlowListSucceededReducer),
  on(resetMapDataAction, resetMapDataReducer),
  on(
    loadAdditionalSensorInfoSucceededAction,
    loadAdditionalSensorInfoSucceededReducer
  ),
  on(setSingularDeviceFiltersAction, setSingularDeviceFiltersReducer)
);

export function reducer(state: ReportingState | undefined, action: Action) {
  return reportingReducer(state, action);
}
