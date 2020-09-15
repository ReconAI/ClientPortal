import { SensorClientInterface } from './../../constants/types/sensors';
import {
  PaginationRequestInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
import { createAction, props } from '@ngrx/store';

export enum DevicesActionsTypes {
  LOAD_SENSORS_LIST_REQUESTED = '[Devices] Load Sensors List Requested',
  LOAD_SENSORS_LIST_SUCCEEDED = '[Devices] Load Sensors List Succeeded',
  LOAD_SENSORS_LIST_ERROR = '[Devices] Load Sensors List Error',
}

export const loadSensorsListRequestedAction = createAction(
  DevicesActionsTypes.LOAD_SENSORS_LIST_REQUESTED,
  props<PaginationRequestInterface>()
);

export const loadSensorsListSucceededAction = createAction(
  DevicesActionsTypes.LOAD_SENSORS_LIST_SUCCEEDED,
  props<PaginationResponseClientInterface<SensorClientInterface>>()
);

export const loadSensorsListErrorAction = createAction(
  DevicesActionsTypes.LOAD_SENSORS_LIST_ERROR
);
