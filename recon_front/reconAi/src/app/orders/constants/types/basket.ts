import { ServerImageInterface } from './device';
export interface BasketItemClientInterface {
  id: number;
  name: string;
  description: string;
  salesPrice: string;
  images: ServerImageInterface;
  count: number;
  totalWithVat: number;
  totalWithoutVat: number;
  vatAmount: number;
}

export interface BasketItemServerInterface {
  id: number;
  name: string;
  description: string;
  sales_price: string;
  images: ServerImageInterface;
  count: number;
  total_with_vat: number;
  total_without_vat: number;
}
