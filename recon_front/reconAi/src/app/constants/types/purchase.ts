import { ServerImageInterface } from './../../orders/constants/types/device';
export interface PurchaseClientInterface {
  paymentId: string;
  type: string;
  date: string;
  total: string;
}

export interface PurchaseServerInterface {
  payment_id: string;
  type: string;
  timestamp: string;
  total: number;
}

export interface PurchaseCardServerInterface {
  payment_id: string;
  device_name: string;
  price_without_vat: number;
  price_with_vat: number;
  device_cnt: number;
  total: number;
  images: ServerImageInterface[];
  created_dt: string;
}

export interface PurchaseCardClientInterface {
  paymentId: string;
  deviceName: string;
  priceWithoutVat: number;
  priceWithVat: number;
  amount: number;
  total: number;
  images: ServerImageInterface[];
  createdDt: string;
}
