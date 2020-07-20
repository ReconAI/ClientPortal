import {
  CREATED_DT_DESC,
  ALL_CATEGORIES_ID_FOR_DEVICE,
} from './../../orders/constants/requests';
import { MetaClientInterface } from './../../constants/types/requests';
import { DeviceFormInterface } from 'app/orders/constants';
import { ManufacturerInterface } from './../../orders/constants/types/manufacturers';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { CategoryInterface } from './../../orders/constants/types/category';
import { createSelector } from '@ngrx/store';
import { AppState } from './../reducers/index';
import {
  OrdersState,
  OrdersError,
  MetaStoreDevicesInterface,
} from './orders.reducer';
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
  (orders: OrdersState): MetaStoreDevicesInterface => orders.meta
);

export const selectDevicesMetaTotalCount = createSelector(
  selectDevicesMeta,
  (meta: MetaStoreDevicesInterface): number => meta?.count || 0
);

export const selectDevicesMetaCurrentPage = createSelector(
  selectDevicesMeta,
  (meta: MetaStoreDevicesInterface): number => meta?.currentPage || 0
);

export const selectDevicesMetaPageSize = createSelector(
  selectDevicesMeta,
  (meta: MetaStoreDevicesInterface): number => meta?.pageSize || 0
);

export const selectDevicesMetaCategoryId = createSelector(
  selectDevicesMeta,
  (meta: MetaStoreDevicesInterface): number =>
    meta.categoryId || ALL_CATEGORIES_ID_FOR_DEVICE
);

export const selectDevicesMetaOrdering = createSelector(
  selectDevicesMeta,
  (meta: MetaStoreDevicesInterface): string => meta.ordering || CREATED_DT_DESC
);
