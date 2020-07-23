import {
  CREATED_DT_DESC,
  ALL_CATEGORIES_ID_FOR_DEVICE,
} from './../../orders/constants/requests';
import { MetaClientInterface } from './../../constants/types/requests';
import {
  CategoriesServerResponseInterface,
  CategoriesClientInterface,
  ManufacturerListResponseClientInterface,
  DeviceListResponseClientInterface,
  DeviceListItemClientInterface,
  PaginatedDeviceListRequestInterface,
  DeviceRequestClientInterface,
} from './orders.server.helpers';
import {
  loadCategoriesSucceededAction,
  updateCategoriesSucceededAction,
  resetCreateManufacturerErrorAction,
  createManufacturerErrorAction,
  loadManufacturerListSucceededAction,
  resetCreateDeviceErrorAction,
  createDeviceErrorAction,
  loadDeviceListSucceededAction,
  updateDeviceListMetaAction,
  loadManagementDeviceSucceededAction,
  resetUpdateDeviceErrorAction,
  updateDeviceErrorAction,
  resetDeviceListMetaAction,
  loadDeviceSucceededAction,
  loadAllCategoriesSucceededAction,
  resetAllCategoriesAction,
} from './orders.actions';
import { CategoryInterface } from './../../orders/constants/types/category';
import { ActivationInterface } from './../../constants/types/activation';
import { UserState } from './../user/user.reducer';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from 'app/constants/types/requests';

import { createReducer, on, Action } from '@ngrx/store';
import {
  ManufacturerInterface,
  DeviceFormInterface,
} from 'app/orders/constants';

export interface OrdersError {
  createManufacturer: FormServerErrorInterface;
  createDevice: FormServerErrorInterface;
  updateDevice: FormServerErrorInterface;
}

export interface MetaStoreDevicesInterface extends MetaClientInterface {
  ordering?: string;
  categoryId?: number;
}

const errorInit: OrdersError = {
  createManufacturer: null,
  createDevice: null,
  updateDevice: null,
};
export interface OrdersState {
  categories: CategoryInterface[];
  manufacturers: ManufacturerInterface[];
  device: DeviceFormInterface;
  devices: DeviceListItemClientInterface[];
  meta: MetaStoreDevicesInterface;
  errors: OrdersError;
}

const metaInit: MetaStoreDevicesInterface = {
  currentPage: 1,
  ordering: CREATED_DT_DESC,
  categoryId: ALL_CATEGORIES_ID_FOR_DEVICE,
};

export const initialState: OrdersState = {
  categories: [],
  manufacturers: [],
  errors: errorInit,
  device: null,
  devices: [],
  meta: metaInit,
};

const loadCategoriesSucceededReducer = (
  state: OrdersState,
  { type, categories }: Action & CategoriesClientInterface
): OrdersState => ({ ...state, categories });

const loadAllCategoriesSucceededReducer = (
  state: OrdersState,
  { type, categories }: Action & CategoriesClientInterface
): OrdersState => ({ ...state, categories });

const resetAllCategoriesReducer = (state: OrdersState): OrdersState => ({
  ...state,
  categories: [],
});

const updateCategoriesSucceededReducer = (
  state: OrdersState,
  { type, categories }: Action & CategoriesClientInterface
): OrdersState => ({ ...state, categories });

const resetCreateManufacturerErrorReducer = (
  state: OrdersState
): OrdersState => ({
  ...state,
  errors: {
    ...state.errors,
    createManufacturer: errorInit.createManufacturer,
  },
});

const createManufacturerErrorReducer = (
  state: OrdersState,
  { type, errors }: Action & ObjectFormErrorInterface
): OrdersState => ({
  ...state,
  errors: {
    ...state.errors,
    createManufacturer: errors,
  },
});

const loadManufacturerListSucceededReducer = (
  state: OrdersState,
  { type, manufacturers }: Action & ManufacturerListResponseClientInterface
): OrdersState => ({
  ...state,
  manufacturers,
});

const createDeviceErrorReducer = (
  state: OrdersState,
  { type, errors }: Action & ObjectFormErrorInterface
): OrdersState => ({
  ...state,
  errors: {
    ...state.errors,
    createDevice: errors,
  },
});

const resetCreateDeviceErrorReducer = (state: OrdersState): OrdersState => ({
  ...state,
  errors: {
    ...state.errors,
    createDevice: errorInit.createDevice,
  },
});

const loadDeviceListSucceededReducer = (
  state: OrdersState,
  { result }: Action & DeviceListResponseClientInterface
): OrdersState => ({
  ...state,
  devices: result.devices,
  meta: {
    ...state.meta,
    ...result.meta,
  },
});
const updateDeviceListMetaReducer = (
  state: OrdersState,
  { type, pagination }: Action & PaginatedDeviceListRequestInterface
): OrdersState => ({
  ...state,
  meta: {
    ...state.meta,
    ...pagination,
  },
});

const loadManagementDeviceSucceededReducer = (
  state: OrdersState,
  { type, device }: Action & DeviceRequestClientInterface
): OrdersState => ({
  ...state,
  device,
});

const resetDeviceListMetaReducer = (state: OrdersState): OrdersState => ({
  ...state,
  meta: metaInit,
});

const updateDeviceErrorReducer = (
  state: OrdersState,
  { type, errors }: Action & ObjectFormErrorInterface
): OrdersState => ({
  ...state,
  errors: {
    ...state.errors,
    updateDevice: errors,
  },
});

const resetUpdateDeviceErrorReducer = (state: OrdersState): OrdersState => ({
  ...state,
  errors: {
    ...state.errors,
    updateDevice: errorInit.updateDevice,
  },
});

const loadDeviceSucceededReducer = (
  state: OrdersState,
  { type, device }: Action & DeviceRequestClientInterface
): OrdersState => ({
  ...state,
  device,
});

const ordersReducer = createReducer(
  initialState,
  on(loadCategoriesSucceededAction, loadCategoriesSucceededReducer),
  on(loadAllCategoriesSucceededAction, loadAllCategoriesSucceededReducer),
  on(updateCategoriesSucceededAction, updateCategoriesSucceededReducer),
  on(createManufacturerErrorAction, createManufacturerErrorReducer),
  on(resetCreateManufacturerErrorAction, resetCreateManufacturerErrorReducer),
  on(loadManufacturerListSucceededAction, loadManufacturerListSucceededReducer),
  on(createDeviceErrorAction, createDeviceErrorReducer),
  on(resetCreateDeviceErrorAction, resetCreateDeviceErrorReducer),
  on(loadDeviceListSucceededAction, loadDeviceListSucceededReducer),
  on(updateDeviceListMetaAction, updateDeviceListMetaReducer),
  on(loadManagementDeviceSucceededAction, loadManagementDeviceSucceededReducer),
  on(updateDeviceErrorAction, updateDeviceErrorReducer),
  on(resetUpdateDeviceErrorAction, resetUpdateDeviceErrorReducer),
  on(resetDeviceListMetaAction, resetDeviceListMetaReducer),
  on(loadDeviceSucceededAction, loadDeviceSucceededReducer),
  on(resetAllCategoriesAction, resetAllCategoriesReducer)
);

export function reducer(state: OrdersState | undefined, action: Action) {
  return ordersReducer(state, action);
}
