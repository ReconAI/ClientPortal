import { CategoryInterface } from './category';
export interface ManufacturerInterface {
  name: string;
  vat: string;
  contactPerson: string;
  phone: string;
  address: string;
  orderEmail: string;
  supportEmail: string;
  // categories: CategoryInterface[];
  id?: number;
}
