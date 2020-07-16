import { CategoriesClientInterface } from './orders.server.helpers';
import { createAction, props } from '@ngrx/store';

export enum OrdersActionTypes {
  LOAD_CATEGORIES_REQUESTED = '[Orders] Load Categories Requested',
  LOAD_CATEGORIES_SUCCEEDED = '[Orders] Load Categories Succeeded',
  LOAD_CATEGORIES_ERROR = '[Orders] Load Categories Error',

  UPDATE_CATEGORIES_REQUESTED = '[Orders] Update Categories Requested',
  UPDATE_CATEGORIES_SUCCEEDED = '[Orders] Update Categories Succeeded',
  UPDATE_CATEGORIES_ERROR = '[Orders] Update Categories Error',
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
