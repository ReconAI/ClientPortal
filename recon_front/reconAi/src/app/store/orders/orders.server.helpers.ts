import {
  MetaClientInterface,
  PaginationResponseServerInterface,
  PaginationRequestInterface,
} from './../../constants/types/requests';
import { getBase64 } from './../../core/helpers/files';
import {
  DeviceServerInterface,
  ServerImageInterface,
  DeviceListServerResponseInterface,
} from './../../orders/constants/types/device';
import { CategoryInterface } from './../../orders/constants/types/category';
import {
  ManufacturerInterface,
  DeviceFormInterface,
} from 'app/orders/constants';

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

export interface ManufacturerServerInterface {
  name: string;
  address: string;
  contact_person: string;
  order_email: string;
  phone: string;
  support_email: string;
  vat: string; // check its type later
  category_ids?: number[];
  categories?: CategoryInterface[];
  id?: number;
}

export interface CreateManufacturerRequestClientInterface {
  manufacturer: ManufacturerInterface;
}

export interface ManufacturerListResponseClientInterface {
  manufacturers: ManufacturerInterface[];
}

export const transformCreateManufacturerRequestToServer = (
  manufacturer: ManufacturerInterface
): ManufacturerServerInterface => ({
  name: manufacturer.name,
  address: manufacturer.address,
  contact_person: manufacturer.contactPerson,
  order_email: manufacturer.orderEmail,
  phone: manufacturer.phone,
  support_email: manufacturer.supportEmail,
  vat: manufacturer.vat,
  category_ids: manufacturer.categories.map(({ id }) => id),
});

export const transformManufactureListFromServer = (
  manufacturers: ManufacturerServerInterface[]
): ManufacturerListResponseClientInterface => ({
  manufacturers: manufacturers.map((manufacturer) => ({
    name: manufacturer.name,
    address: manufacturer.address,
    contactPerson: manufacturer.contact_person,
    orderEmail: manufacturer.order_email,
    phone: manufacturer.phone,
    supportEmail: manufacturer.support_email,
    vat: manufacturer.vat,
    categories: manufacturer.categories,
    id: manufacturer.id,
  })),
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

export interface CreateDeviceRequestClientInterface {
  device: DeviceFormInterface;
}

export const transformCreateDeviceRequestToServer = async (
  device: DeviceFormInterface
): Promise<DeviceServerInterface> => {
  const deviceImages = device.images;
  const based64Images: string[] = [];

  for (let i = 0; i < deviceImages.length; i++) {
    based64Images.push((await getBase64(deviceImages[i] as File)).toString());
  }

  return {
    name: device.name,
    description: device.description,
    manufacturer: device.manufacturer,
    buying_price: device.buyingPrice,
    sales_price: device.salesPrice,
    product_number: device.product,
    seo_title: device.seoTitle,
    seo_keywords: device.seoTags,
    seo_description: device.seoDescription,
    images: based64Images,
  };
};

export const deviceFormFieldLabels = {
  name: 'Name',
  description: 'Description',
  manufacturer: 'Manufacture',
  buying_price: 'Buying price per device',
  sales_price: 'Sales price per device',
  product_number: 'Product number',
  seo_title: 'SEO title',
  seo_keywords: 'SEO tags',
  seo_description: 'SEO description',
  images: 'Images',
};

export interface DeviceListItemClientInterface {
  name: string;
  description: string;
  salesPrice: string;
  images: string[];
  id: number;
}

export interface DeviceListResponseClientInterface {
  result: {
    devices: DeviceListItemClientInterface[];
    meta: MetaClientInterface;
  };
}

export interface DeviceListItemServerInterface {
  id: number;
  name: string;
  description: string;
  manufacturer: ManufacturerServerInterface;
  buying_price: string;
  sales_price: string;
  product_number: string;
  seo_title: string;
  seo_keywords: string[];
  seo_description: string;
  published: boolean;
  images: ServerImageInterface[];
  created_dt: string;
}
export const transformLoadedDevicesFromServer = (
  response: PaginationResponseServerInterface<DeviceListServerResponseInterface>
): DeviceListResponseClientInterface => ({
  result: {
    devices: response.results.map((device) => ({
      id: device.id,
      name: device.name,
      description: device.description,
      images: device.images.map((image: ServerImageInterface) => image.path),
      salesPrice: device.sales_price,
    })),
    meta: {
      pageSize: response.page_size,
      currentPage: response.current,
      count: response.count,
    },
  },
});

export interface DeleteDeviceRequestInterface {
  id: number;
}

export interface PaginatedDeviceListRequestInterface
  extends PaginationRequestInterface {
  ordering?: string;
  categoryId?: number;
}
