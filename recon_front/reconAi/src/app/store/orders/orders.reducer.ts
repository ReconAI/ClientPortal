import {
  CategoriesServerResponseInterface,
  CategoriesClientInterface,
  ManufacturerListResponseClientInterface,
} from './orders.server.helpers';
import {
  loadCategoriesSucceededAction,
  updateCategoriesSucceededAction,
  resetCreateManufacturerErrorAction,
  createManufacturerErrorAction,
  loadManufacturerListSucceededAction,
} from './orders.actions';
import { CategoryInterface } from './../../orders/constants/types/category';
import { ActivationInterface } from './../../constants/types/activation';
import { UserState } from './../user/user.reducer';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from 'app/constants/types/requests';

import { createReducer, on, Action } from '@ngrx/store';
import { ManufacturerInterface } from 'app/orders/constants';

export interface OrdersError {
  createManufacturer: FormServerErrorInterface;
}

const errorInit: OrdersError = {
  createManufacturer: null,
};
export interface OrdersState {
  categories: CategoryInterface[];
  manufacturers: ManufacturerInterface[];
  errors: OrdersError;
}

export const initialState: OrdersState = {
  categories: [],
  manufacturers: [],
  errors: errorInit,
};

const loadCategoriesSucceededReducer = (
  state: OrdersState,
  { type, categories }: Action & CategoriesClientInterface
): OrdersState => ({ ...state, categories });

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
  manufacturers
});

const ordersReducer = createReducer(
  initialState,
  on(loadCategoriesSucceededAction, loadCategoriesSucceededReducer),
  on(updateCategoriesSucceededAction, updateCategoriesSucceededReducer),
  on(createManufacturerErrorAction, createManufacturerErrorReducer),
  on(resetCreateManufacturerErrorAction, resetCreateManufacturerErrorReducer),
  on(loadManufacturerListSucceededAction, loadManufacturerListSucceededReducer)
);

export function reducer(state: OrdersState | undefined, action: Action) {
  return ordersReducer(state, action);
}
