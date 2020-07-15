import {
  CategoriesServerResponseInterface,
  CategoriesClientInterface,
} from './orders.server.helpers';
import {
  loadCategoriesSucceededAction,
  updateCategoriesSucceededAction,
} from './orders.actions';
import { CategoryInterface } from './../../orders/constants/types/category';
import { ActivationInterface } from './../../constants/types/activation';
import { UserState } from './../user/user.reducer';
import {
  FormServerErrorInterface,
  ObjectFormErrorInterface,
} from 'app/constants/types/requests';

import { createReducer, on, Action } from '@ngrx/store';

export interface OrdersState {
  categories: CategoryInterface[];
  errors: any;
}

export const initialState: OrdersState = {
  categories: [],
  errors: null,
};

const loadCategoriesSucceededReducer = (
  state: OrdersState,
  { type, categories }: Action & CategoriesClientInterface
): OrdersState => ({ ...state, categories });

const ordersReducer = createReducer(
  initialState,
  on(loadCategoriesSucceededAction, loadCategoriesSucceededReducer)
);

export function reducer(state: OrdersState | undefined, action: Action) {
  return ordersReducer(state, action);
}
