import { ObjectFormErrorInterface, FormServerErrorInterface } from 'app/constants/types/requests';
import {
  CategoriesClientInterface,
  CreateManufacturerRequestClientInterface,
  ManufacturerListResponseClientInterface,
  CreateDeviceRequestClientInterface,
  DeviceListResponseClientInterface,
  IdDeviceRequestInterface,
  PaginatedDeviceListRequestInterface,
  DeviceRequestClientInterface,
  BasketOverviewRequestClientInterface,
  BasketItemsInterface,
  BasketPaymentRequestClientInterface,
  BasketPaymentSucceededInterface,
  BasketPaymentRequestActionInterface,
} from './orders.server.helpers';
import { createAction, props } from '@ngrx/store';

export enum OrdersActionTypes {
  LOAD_CATEGORIES_REQUESTED = '[Orders] Load Categories Requested',
  LOAD_CATEGORIES_SUCCEEDED = '[Orders] Load Categories Succeeded',
  LOAD_CATEGORIES_ERROR = '[Orders] Load Categories Error',

  // for management crud
  LOAD_ALL_CATEGORIES_REQUESTED = '[Orders] Load All Categories Requested',
  LOAD_ALL_CATEGORIES_SUCCEEDED = '[Orders] Load All Categories Succeeded',
  LOAD_ALL_CATEGORIES_ERROR = '[Orders] Load All Categories Error',
  RESET_ALL_CATEGORIES = '[Orders] Reset All Categories',

  UPDATE_CATEGORIES_REQUESTED = '[Orders] Update Categories Requested',
  UPDATE_CATEGORIES_SUCCEEDED = '[Orders] Update Categories Succeeded',
  UPDATE_CATEGORIES_ERROR = '[Orders] Update Categories Error',

  CREATE_MANUFACTURER_REQUESTED = '[Orders] Create Manufacturer Requested',
  CREATE_MANUFACTURER_SUCCEEDED = '[Orders] Create Manufacturer Succeeded',
  CREATE_MANUFACTURER_ERROR = '[Orders] Create Manufacturer Error',
  RESET_CREATE_MANUFACTURER_ERROR = '[Orders] Reset Create Manufacturer Error',

  LOAD_MANUFACTURER_LIST_REQUESTED = '[Orders] Load Manufacturer List Requested',
  LOAD_MANUFACTURER_LIST_SUCCEEDED = '[Orders] Load Manufacturer List Succeeded',
  LOAD_MANUFACTURER_LIST_ERROR = '[Orders] Load Manufacturer List Error',

  CREATE_DEVICE_REQUESTED = '[Orders] Create Device Requested',
  CREATE_DEVICE_SUCCEEDED = '[Orders] Create Device Succeeded',
  CREATE_DEVICE_ERROR = '[Orders] Create Device Error',
  RESET_CREATE_DEVICE_ERROR = '[Orders] Reset Create Device Error',

  LOAD_DEVICE_LIST_REQUESTED = '[Orders] Load Device List Requested',
  LOAD_DEVICE_LIST_SUCCEEDED = '[Orders] Load Device List Succeeded',
  LOAD_DEVICE_LIST_ERROR = '[Orders] Load Device List Error',
  UPDATE_DEVICE_LIST_META = '[Orders] Update Device List Meta',
  RESET_DEVICE_LIST_META = '[Orders] Reset Device List Meta',

  DELETE_DEVICE_REQUESTED = '[Orders] Delete Device Requested',
  DELETE_DEVICE_SUCCEEDED = '[Orders] Delete Device Succeeded',
  DELETE_DEVICE_ERROR = '[Orders] Delete Device Error',

  LOAD_MANAGEMENT_DEVICE_REQUESTED = '[Orders] Load Management Device Requested',
  LOAD_MANAGEMENT_DEVICE_SUCCEEDED = '[Orders] Load Management Device Succeeded',
  LOAD_MANAGEMENT_DEVICE_ERROR = '[Orders] Load Management Device Error',

  UPDATE_DEVICE_REQUESTED = '[Orders] Update Device Requested',
  UPDATE_DEVICE_SUCCEEDED = '[Orders] Update Device Succeeded',
  UPDATE_DEVICE_ERROR = '[Orders] Update Device Error',
  RESET_UPDATE_DEVICE_ERROR = '[Orders] Reset Update Device Error',

  LOAD_DEVICE_REQUESTED = '[Orders] Load Device Requested',
  LOAD_DEVICE_SUCCEEDED = '[Orders] Load Device Succeeded',
  LOAD_DEVICE_ERROR = '[Orders] Load Device Error',

  LOAD_BASKET_OVERVIEW_REQUESTED = '[Orders] Load Basket Overview Requested',
  LOAD_BASKET_OVERVIEW_SUCCEEDED = '[Orders] Load Basket Overview Succeeded',
  LOAD_BASKET_OVERVIEW_ERROR = '[Orders] Load Basket Overview Error',

  PAY_BASKET_REQUESTED = '[Orders] Pay Basket Requested',
  PAY_BASKET_SUCCEEDED = '[Orders] Pay Basket Succeeded',
  PAY_BASKET_ERROR = '[Orders] Pay Basket Error',
}

export const loadCategoriesRequestedAction = createAction(
  OrdersActionTypes.LOAD_CATEGORIES_REQUESTED
);

export const loadCategoriesSucceededAction = createAction(
  OrdersActionTypes.LOAD_CATEGORIES_SUCCEEDED,
  props<CategoriesClientInterface>()
);

export const loadCategoriesErrorAction = createAction(
  OrdersActionTypes.LOAD_CATEGORIES_ERROR
);

export const loadAllCategoriesRequestedAction = createAction(
  OrdersActionTypes.LOAD_ALL_CATEGORIES_REQUESTED
);

export const loadAllCategoriesSucceededAction = createAction(
  OrdersActionTypes.LOAD_ALL_CATEGORIES_SUCCEEDED,
  props<CategoriesClientInterface>()
);

export const loadAllCategoriesErrorAction = createAction(
  OrdersActionTypes.LOAD_ALL_CATEGORIES_ERROR
);

export const resetAllCategoriesAction = createAction(
  OrdersActionTypes.RESET_ALL_CATEGORIES
);

export const updateCategoriesRequestedAction = createAction(
  OrdersActionTypes.UPDATE_CATEGORIES_REQUESTED,
  props<CategoriesClientInterface>()
);

export const updateCategoriesSucceededAction = createAction(
  OrdersActionTypes.UPDATE_CATEGORIES_SUCCEEDED,
  props<CategoriesClientInterface>()
);

export const updateCategoriesErrorAction = createAction(
  OrdersActionTypes.UPDATE_CATEGORIES_ERROR
);

export const createManufacturerRequestedAction = createAction(
  OrdersActionTypes.CREATE_MANUFACTURER_REQUESTED,
  props<CreateManufacturerRequestClientInterface>()
);

export const createManufacturerSucceededAction = createAction(
  OrdersActionTypes.CREATE_MANUFACTURER_SUCCEEDED
);

export const createManufacturerErrorAction = createAction(
  OrdersActionTypes.CREATE_MANUFACTURER_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetCreateManufacturerErrorAction = createAction(
  OrdersActionTypes.RESET_CREATE_MANUFACTURER_ERROR
);

export const loadManufacturerListRequestedAction = createAction(
  OrdersActionTypes.LOAD_MANUFACTURER_LIST_REQUESTED
);

export const loadManufacturerListSucceededAction = createAction(
  OrdersActionTypes.LOAD_MANUFACTURER_LIST_SUCCEEDED,
  props<ManufacturerListResponseClientInterface>()
);

export const loadManufacturerListErrorAction = createAction(
  OrdersActionTypes.LOAD_MANUFACTURER_LIST_ERROR
);

export const createDeviceRequestedAction = createAction(
  OrdersActionTypes.CREATE_DEVICE_REQUESTED,
  props<CreateDeviceRequestClientInterface>()
);

export const createDeviceSucceededAction = createAction(
  OrdersActionTypes.CREATE_DEVICE_SUCCEEDED
);

export const createDeviceErrorAction = createAction(
  OrdersActionTypes.CREATE_DEVICE_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetCreateDeviceErrorAction = createAction(
  OrdersActionTypes.RESET_CREATE_DEVICE_ERROR
);

export const loadDeviceListRequestedAction = createAction(
  OrdersActionTypes.LOAD_DEVICE_LIST_REQUESTED
);

export const loadDeviceListSucceededAction = createAction(
  OrdersActionTypes.LOAD_DEVICE_LIST_SUCCEEDED,
  props<DeviceListResponseClientInterface>()
);

export const loadDeviceListErrorAction = createAction(
  OrdersActionTypes.LOAD_DEVICE_LIST_ERROR
);

export const deleteDeviceRequestedAction = createAction(
  OrdersActionTypes.DELETE_DEVICE_REQUESTED,
  props<IdDeviceRequestInterface>()
);

export const deleteDeviceSucceededAction = createAction(
  OrdersActionTypes.DELETE_DEVICE_SUCCEEDED
);

export const deleteDeviceErrorAction = createAction(
  OrdersActionTypes.DELETE_DEVICE_ERROR
);

export const loadManagementDeviceRequestedAction = createAction(
  OrdersActionTypes.LOAD_MANAGEMENT_DEVICE_REQUESTED,
  props<IdDeviceRequestInterface>()
);

export const loadManagementDeviceSucceededAction = createAction(
  OrdersActionTypes.LOAD_MANAGEMENT_DEVICE_SUCCEEDED,
  props<DeviceRequestClientInterface>()
);

export const loadManagementDeviceErrorAction = createAction(
  OrdersActionTypes.LOAD_MANAGEMENT_DEVICE_ERROR
);

export const updateDeviceListMetaAction = createAction(
  OrdersActionTypes.UPDATE_DEVICE_LIST_META,
  props<PaginatedDeviceListRequestInterface>()
);

export const resetDeviceListMetaAction = createAction(
  OrdersActionTypes.RESET_DEVICE_LIST_META
);

export const updateDeviceRequestedAction = createAction(
  OrdersActionTypes.UPDATE_DEVICE_REQUESTED,
  props<CreateDeviceRequestClientInterface>()
);

export const updateDeviceSucceededAction = createAction(
  OrdersActionTypes.UPDATE_DEVICE_SUCCEEDED
);

export const updateDeviceErrorAction = createAction(
  OrdersActionTypes.UPDATE_DEVICE_ERROR,
  props<ObjectFormErrorInterface>()
);

export const resetUpdateDeviceErrorAction = createAction(
  OrdersActionTypes.RESET_UPDATE_DEVICE_ERROR
);

export const loadDeviceRequestedAction = createAction(
  OrdersActionTypes.LOAD_DEVICE_REQUESTED,
  props<IdDeviceRequestInterface>()
);

export const loadDeviceSucceededAction = createAction(
  OrdersActionTypes.LOAD_DEVICE_SUCCEEDED,
  props<DeviceRequestClientInterface>()
);

export const loadDeviceErrorAction = createAction(
  OrdersActionTypes.LOAD_DEVICE_ERROR
);

export const loadBasketOverviewRequestedAction = createAction(
  OrdersActionTypes.LOAD_BASKET_OVERVIEW_REQUESTED
);

export const loadBasketOverviewSucceededAction = createAction(
  OrdersActionTypes.LOAD_BASKET_OVERVIEW_SUCCEEDED,
  props<BasketItemsInterface>()
);

export const loadBasketOverviewErrorAction = createAction(
  OrdersActionTypes.LOAD_BASKET_OVERVIEW_ERROR
);

export const payBasketRequestedAction = createAction(
  OrdersActionTypes.PAY_BASKET_REQUESTED,
  props<BasketPaymentRequestActionInterface>()
);

export const payBasketSucceededAction = createAction(
  OrdersActionTypes.PAY_BASKET_SUCCEEDED,
  props<BasketPaymentSucceededInterface>()
);

export const payBasketErrorAction = createAction(
  OrdersActionTypes.PAY_BASKET_ERROR,
  props<FormServerErrorInterface>()
);
