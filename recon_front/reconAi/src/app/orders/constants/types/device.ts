import { ManufacturerServerInterface } from 'app/store/orders/orders.server.helpers';

export interface DeviceFormInterface {
  name: string;
  manufacturer: string;
  images: File[] | string[];
  product: string;
  description: string;
  buyingPrice: string;
  salesPrice: string;
  seoTags: string[];
  seoTitle: string;
  seoDescription: string;
  category?: string;
  id?: number;
}

export interface ServerImageInterface {
  id: number;
  path: string;
}
export interface DeviceServerInterface {
  name: string;
  description: string;
  manufacturer: string | ManufacturerServerInterface;
  buying_price: string;
  sales_price: string;
  product_number: string;
  seo_title: string;
  seo_keywords: string[];
  seo_description: string;
  images: string[] | ServerImageInterface[];
  id?: number;
}

export interface DeviceListServerResponseInterface {
  name: string;
  description: string;
  sales_price: string;
  images: ServerImageInterface[];
  id: number;
}
