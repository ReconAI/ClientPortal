import {
  loadPurchaseListSucceededAction,
  loadPurchaseSucceededAction,
} from './purchases.actions';
import {
  PurchaseClientInterface,
  PurchaseCardClientInterface,
} from './../../constants/types/purchase';
import {
  MetaClientInterface,
  PaginationResponseClientInterface,
} from './../../constants/types/requests';
import { createReducer, Action, on } from '@ngrx/store';
import { PurchaseCardClientResponseInterface } from './purchases.server.helpers';

export interface PurchaseState {
  list: PurchaseClientInterface[];
  meta: MetaClientInterface;
  purchase: PurchaseCardClientInterface[];
}

export const initialState: PurchaseState = {
  list: [],
  meta: null,
  purchase: [],
};

const loadPurchaseListSucceededReducer = (
  state: PurchaseState,
  {
    type,
    ...payload
  }: Action & PaginationResponseClientInterface<PurchaseClientInterface>
): PurchaseState => ({ ...state, ...payload });

const loadPurchaseSucceededReducer = (
  state: PurchaseState,
  { type, purchases }: Action & PurchaseCardClientResponseInterface
): PurchaseState => ({ ...state, purchase: purchases });

const purchaseReducer = createReducer(
  initialState,
  on(loadPurchaseListSucceededAction, loadPurchaseListSucceededReducer),
  on(loadPurchaseSucceededAction, loadPurchaseSucceededReducer)
);

export function reducer(state: PurchaseState | undefined, action: Action) {
  return purchaseReducer(state, action);
}
