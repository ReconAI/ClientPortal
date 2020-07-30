export interface FormServerErrorInterface {
  [key: string]: string;
}

export interface ObjectFormErrorInterface {
  errors: FormServerErrorInterface;
}

export interface UrlInterceptorInterface {
  url: string;
  method?: string;
}

export interface PaginationRequestInterface {
  page: number;
}

export interface PaginationResponseServerInterface<T> {
  count: number;
  current: number;
  page_size: number;
  results: T[];
}

export interface PaginationResponseClientInterface<T> {
  meta: MetaClientInterface;
  list: T[];
}
export interface MetaClientInterface {
  count?: number;
  currentPage?: number;
  pageSize?: number;
}
