import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
  PaginationRequestInterface,
} from 'app/constants/types/requests';
import {
  CategoriesClientInterface,
  CreateManufacturerRequestClientInterface,
  ManufacturerListResponseClientInterface,
} from './orders.server.helpers';
import { createAction, props } from '@ngrx/store';

export enum OrdersActionTypes {
  LOAD_CATEGORIES_REQUESTED = '[Orders] Load Categories Requested',
  LOAD_CATEGORIES_SUCCEEDED = '[Orders] Load Categories Succeeded',
  LOAD_CATEGORIES_ERROR = '[Orders] Load Categories Error',

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
  OrdersActionTypes.LOAD_MANUFACTURER_LIST_REQUESTED,
);

export const loadManufacturerListSucceededAction = createAction(
  OrdersActionTypes.LOAD_MANUFACTURER_LIST_SUCCEEDED,
  props<ManufacturerListResponseClientInterface>()
);

export const loadManufacturerListErrorAction = createAction(
  OrdersActionTypes.LOAD_MANUFACTURER_LIST_ERROR
);
