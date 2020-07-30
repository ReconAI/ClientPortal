import {
  PaginationResponseServerInterface,
  PaginationResponseClientInterface,
} from 'app/constants/types/requests';
import {
  PurchaseClientInterface,
  PurchaseCardClientInterface,
} from './../../constants/types/purchase';
import { PaginationRequestInterface } from './../../constants/types/requests';
import { createAction, props } from '@ngrx/store';
import {
  PurchaseRequestInterface,
  PurchaseCardClientResponseInterface,
} from './purchases.server.helpers';

export enum PurchaseActionTypes {
  LOAD_PURCHASE_LIST_REQUESTED = '[Purchase] Load Purchase List Requested',
  LOAD_PURCHASE_LIST_SUCCEEDED = '[Purchase] Load Purchase List Succeeded',
  LOAD_PURCHASE_LIST_ERROR = '[Purchase] Load Purchase List Error',

  LOAD_PURCHASE_REQUESTED = '[Purchase] Load Purchase Requested',
  LOAD_PURCHASE_SUCCEEDED = '[Purchase] Load Purchase Succeeded',
  LOAD_PURCHASE_ERROR = '[Purchase] Load Purchase Error',
}

export const loadPurchaseListRequestedAction = createAction(
  PurchaseActionTypes.LOAD_PURCHASE_LIST_REQUESTED,
  props<PaginationRequestInterface>()
);

export const loadPurchaseListSucceededAction = createAction(
  PurchaseActionTypes.LOAD_PURCHASE_LIST_SUCCEEDED,
  props<PaginationResponseClientInterface<PurchaseClientInterface>>()
);

export const loadPurchaseListErrorAction = createAction(
  PurchaseActionTypes.LOAD_PURCHASE_LIST_ERROR
);

export const loadPurchaseRequestedAction = createAction(
  PurchaseActionTypes.LOAD_PURCHASE_REQUESTED,
  props<PurchaseRequestInterface>()
);

export const loadPurchaseSucceededAction = createAction(
  PurchaseActionTypes.LOAD_PURCHASE_SUCCEEDED,
  props<PurchaseCardClientResponseInterface>()
);

export const loadPurchaseErrorAction = createAction(
  PurchaseActionTypes.LOAD_PURCHASE_ERROR
);
