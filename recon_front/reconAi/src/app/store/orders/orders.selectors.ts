import { MetaClientInterface } from './../../constants/types/requests';
import { DeviceFormInterface } from 'app/orders/constants';
import { ManufacturerInterface } from './../../orders/constants/types/manufacturers';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { CategoryInterface } from './../../orders/constants/types/category';
import { createSelector } from '@ngrx/store';
import { AppState } from './../reducers/index';
import { OrdersState, OrdersError } from './orders.reducer';
import { DeviceListItemClientInterface } from './orders.server.helpers';

export const selectOrders = (state: AppState): OrdersState => state.orders;

export const selectOrderCategoriesList = createSelector(
  selectOrders,
  (orders: OrdersState): CategoryInterface[] => orders.categories
);

export const selectOrdersErrors = createSelector(
  selectOrders,
  (orders: OrdersState): OrdersError => orders?.errors
);

export const selectCreateManufacturerError = createSelector(
  selectOrdersErrors,
  (errors: OrdersError): FormServerErrorInterface =>
    errors?.createManufacturer || null
);

export const selectManufacturerList = createSelector(
  selectOrders,
  (orders: OrdersState): ManufacturerInterface[] => orders?.manufacturers || []
);

export const selectCreateDeviceError = createSelector(
  selectOrdersErrors,
  (errors: OrdersError): FormServerErrorInterface =>
    errors?.createDevice || null
);

export const selectDevices = createSelector(
  selectOrders,
  (orders: OrdersState): DeviceListItemClientInterface[] => orders.devices || []
);

export const selectDevicesMeta = createSelector(
  selectOrders,
  (orders: OrdersState): MetaClientInterface => orders.meta
);

export const selectDevicesMetaTotalCount = createSelector(
  selectDevicesMeta,
  (meta: MetaClientInterface): number => meta?.count || 0
);

export const selectDevicesMetaCurrentPage = createSelector(
  selectDevicesMeta,
  (meta: MetaClientInterface): number => meta?.currentPage || 0
);

export const selectDevicesMetaPageSize = createSelector(
  selectDevicesMeta,
  (meta: MetaClientInterface): number => meta?.pageSize || 0
);
