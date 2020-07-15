import { CategoriesClientInterface } from './orders.server.helpers';
import { createAction, props } from '@ngrx/store';

export enum OrdersActionTypes {
  LOAD_CATEGORIES_REQUESTED = '[Orders] Load Categories Requested',
  LOAD_CATEGORIES_SUCCEEDED = '[Orders] Load Categories Succeeded',
  LOAD_CATEGORIES_ERROR = '[Orders] Load Categories Error',
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
