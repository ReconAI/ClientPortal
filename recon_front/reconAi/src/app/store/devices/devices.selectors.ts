import { SensorClientInterface } from './../../constants/types/sensors';
import { DevicesState } from './devices.reducer';
import { MetaClientInterface } from './../../constants/types/requests';

import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';

export const selectDevices = (state: AppState): DevicesState =>
  state?.devices || null;

export const selectSensorList = createSelector(
  selectDevices,
  (devices: DevicesState): SensorClientInterface[] =>
    devices?.sensors?.list || []
);

export const selectSensorListMeta = createSelector(
  selectDevices,
  (devices: DevicesState): MetaClientInterface => devices?.sensors?.meta
);

export const selectSensorListMetaCurrentPage = createSelector(
  selectSensorListMeta,
  (meta: MetaClientInterface): number => meta?.currentPage
);

export const selectSensorListMetaCount = createSelector(
  selectSensorListMeta,
  (meta: MetaClientInterface): number => meta?.count
);

export const selectSensorListMetaPageSize = createSelector(
  selectSensorListMeta,
  (meta: MetaClientInterface): number => meta?.pageSize
);
