import { ServerImageInterface } from './../../orders/constants/types/device';
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

// device info
export const selectDevice = createSelector(
  selectOrders,
  (orders: OrdersState): DeviceFormInterface => orders?.device || null
);

export const selectDoesExistDevice = createSelector(
  selectOrders,
  (orders: OrdersState): boolean => !!orders?.device
);

export const selectDeviceName = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.name || null
);

export const selectDeviceManufacturerId = createSelector(
  selectDevice,
  (device: DeviceFormInterface): number =>
    (device?.manufacturer as number) || null
);

export const selectDeviceManufacturer = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string =>
    (device?.manufacturer as string) || null
);

export const selectDeviceDescription = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.description || null
);

export const selectDeviceBuyingPrice = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.buyingPrice || null
);

export const selectDeviceSalesPrice = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.salesPrice || null
);

export const selectDeviceProduct = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.product || null
);

export const selectDeviceSeoTitle = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.seoTitle || null
);

export const selectDeviceSeoTags = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string[] | string => device?.seoTags || null
);

export const selectDeviceSeoDescription = createSelector(
  selectDevice,
  (device: DeviceFormInterface): string => device?.seoDescription || null
);

export const selectDeviceImages = createSelector(
  selectDevice,
  (device: DeviceFormInterface): ServerImageInterface[] =>
    (device?.images as ServerImageInterface[]) || []
);

export const selectDeviceId = createSelector(
  selectDevice,
  (device: DeviceFormInterface): number => device?.id
);

export const selectUpdateDeviceError = createSelector(
  selectOrdersErrors,
  (errors: OrdersError): FormServerErrorInterface =>
    errors?.updateDevice || null
);
