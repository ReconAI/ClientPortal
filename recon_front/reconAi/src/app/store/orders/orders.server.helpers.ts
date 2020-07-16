import { CategoryInterface } from './../../orders/constants/types/category';
import { ManufacturerInterface } from 'app/orders/constants';

export interface CategoriesServerResponseInterface {
  results: CategoryInterface[];
}

export interface CategoriesClientInterface {
  categories: CategoryInterface[];
}

export const transformCategoriesFromServer = (
  response: CategoryInterface[]
): CategoriesClientInterface => {
  return {
    categories: response,
  };
};

export interface CategoriesFormInterface {
  categories: string[];
}

export interface CreateManufacturerRequestServerInterface {
  name: string;
  address: string;
  contact_person: string;
  order_email: string;
  phone: string;
  support_email: string;
  vat: string; // check its type later
  category_ids: number[];
}

export interface CreateManufacturerRequestClientInterface {
  manufacturer: ManufacturerInterface;
}

export interface ManufacturerListResponseClientInterface {
  manufacturers: ManufacturerInterface[];
}

export const transformCreateManufacturerRequestToServerInterface = (
  manufacturer: ManufacturerInterface
): CreateManufacturerRequestServerInterface => ({
  name: manufacturer.name,
  address: manufacturer.address,
  contact_person: manufacturer.contactPerson,
  order_email: manufacturer.orderEmail,
  phone: manufacturer.phone,
  support_email: manufacturer.supportEmail,
  vat: manufacturer.vat,
  category_ids: manufacturer.categories.map(({ id }) => id),
});

export const manufacturerFormFieldLabels = {
  name: 'Name',
  address: 'Address',
  contact_person: 'Contact person',
  order_email: 'Order email',
  phone: 'Phone',
  support_email: 'Support email',
  vat: 'VAT number',
  category_ids: 'Categories',
};
