import { ManufacturerServerInterface } from 'app/store/orders/orders.server.helpers';

export interface DeviceFormInterface {
  name: string;
  manufacturer?: string | number;
  manufacturer_id?: number;
  images: File[] | string[] | ServerImageInterface[];
  product: string;
  description: string;
  buyingPrice: string;
  salesPrice: string;
  salesPriceWithVat?: string;
  seoTags: string[] | string;
  seoTitle: string;
  seoDescription: string;
  category?: string | number;
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
  sales_price_with_vat?: string;
  product_number: string;
  seo_title: string;
  seo_keywords: string[] | string;
  seo_description: string;
  images: string[] | ServerImageInterface[];
  id?: number;
  delete_images?: number[];
  category: number;
}

export interface DeviceListServerResponseInterface {
  name: string;
  description: string;
  sales_price: string;
  images: ServerImageInterface[];
  id: number;
}
