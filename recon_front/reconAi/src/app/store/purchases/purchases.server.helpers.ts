import { PaginationResponseClientInterface } from './../../constants/types/requests';
import {
  PurchaseServerInterface,
  PurchaseClientInterface,
  PurchaseCardClientInterface,
  PurchaseCardServerInterface,
} from './../../constants/types/purchase';
import moment from 'moment';

export const transformPurchaseListFromServer = (
  data: PaginationResponseClientInterface<PurchaseServerInterface>
): PaginationResponseClientInterface<PurchaseClientInterface> => ({
  ...data,
  list: data.list.map((purchase) => ({
    paymentId: purchase.payment_id,
    date: moment(purchase.timestamp).format('YYYY.MM.DD'),
    total: (purchase?.total || 0).toFixed(2),
    type: purchase.type,
  })),
});

export interface PurchaseRequestInterface {
  id: string;
}

export interface PurchaseCardClientResponseInterface {
  purchases: PurchaseCardClientInterface[];
}

export const transformPurchaseFromServer = (
  purchases: PurchaseCardServerInterface[]
): PurchaseCardClientResponseInterface => ({
  purchases: purchases.map((purchase) => ({
    paymentId: purchase.payment_id,
    createdDt: moment(purchase.created_dt).format('YYYY.MM.DD'),
    amount: purchase.device_cnt,
    priceWithoutVat: purchase.price_without_vat,
    priceWithVat: purchase.price_with_vat,
    images: purchase.images,
    deviceName: purchase.device_name,
    total: purchase.total,
  })),
});
