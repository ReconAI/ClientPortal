export interface DeviceFormInterface {
  name: string;
  manufacturer: string;
  images: File[];
  product: string;
  description: string;
  buyingPrice: string;
  salesPrice: string;
  seoTags: string[];
  seoTitle: string;
  seoDescription: string;
  category: string;
}

export interface DeviceServerInterface {
  name: string;
  description: string;
  manufacturer: string;
  buying_price: string;
  sales_price: string;
  product_number: string;
  seo_title: string;
  seo_keywords: string[];
  seo_description: string;
  images: string[];
}
