import { ManufacturerInterface } from './../../orders/constants/types/manufacturers';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import { CategoryInterface } from './../../orders/constants/types/category';
import { createSelector } from '@ngrx/store';
import { AppState } from './../reducers/index';
import { OrdersState } from './orders.reducer';

export const selectOrders = (state: AppState): OrdersState => state.orders;

export const selectOrderCategoriesList = createSelector(
  selectOrders,
  (orders: OrdersState): CategoryInterface[] => orders.categories
);

export const selectCreateManufacturerError = createSelector(
  selectOrders,
  (orders: OrdersState): FormServerErrorInterface =>
    orders?.errors?.createManufacturer || null
);

export const selectManufacturerList = createSelector(
  selectOrders,
  (orders: OrdersState): ManufacturerInterface[] => orders?.manufacturers || []
);
