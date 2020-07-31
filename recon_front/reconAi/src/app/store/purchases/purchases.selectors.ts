import {
  PurchaseClientInterface,
  PurchaseCardClientInterface,
} from './../../constants/types/purchase';
import { PurchaseState } from './purchases.reducer';
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';

export const selectPurchases = (state: AppState): PurchaseState =>
  state.purchases;

export const selectPurchaseList = createSelector(
  selectPurchases,
  (purchases: PurchaseState): PurchaseClientInterface[] => purchases?.list || []
);

export const selectPurchaseListMetaCount = createSelector(
  selectPurchases,
  (purchases: PurchaseState): number => purchases?.meta?.count || 0
);

export const selectPurchaseListMetaCurrentPage = createSelector(
  selectPurchases,
  (purchases: PurchaseState): number => purchases?.meta?.currentPage || 0
);

export const selectPurchaseListMetaPageSize = createSelector(
  selectPurchases,
  (purchases: PurchaseState): number => purchases?.meta?.pageSize || 0
);

export const selectPurchaseCard = createSelector(
  selectPurchases,
  (purchases: PurchaseState): PurchaseCardClientInterface[] =>
    purchases?.purchase || []
);
