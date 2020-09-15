import { SensorClientInterface } from './../../constants/types/sensors';

import {
  MetaClientInterface,
  PaginationResponseClientInterface,
} from './../../constants/types/requests';
import { createReducer, Action, on } from '@ngrx/store';
import { loadSensorsListSucceededAction } from './devices.actions';

export interface DevicesState {
  sensors: {
    list: SensorClientInterface[];
    meta: MetaClientInterface;
  };
}

export const initialState: DevicesState = {
  sensors: {
    list: [],
    meta: null,
  },
};

const loadSensorsListSucceededReducer = (
  state: DevicesState,
  {
    list,
    meta,
  }: Action & PaginationResponseClientInterface<SensorClientInterface>
): DevicesState => ({
  ...state,
  sensors: {
    list,
    meta,
  },
});

const devicesReducer = createReducer(
  initialState,
  on(loadSensorsListSucceededAction, loadSensorsListSucceededReducer)
);

export function reducer(state: DevicesState | undefined, action: Action) {
  return devicesReducer(state, action);
}
